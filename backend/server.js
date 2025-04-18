import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import crypto from 'crypto';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5173/auth/google/callback'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json());
app.use(cookieParser());

// Configuração da sessão
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Em desenvolvimento, use false
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
};

app.use(session(sessionConfig));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Configurar a chave de API
oauth2Client.apiKey = process.env.GOOGLE_API_KEY;

// Configuração de segurança adicional
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // Armazene o refresh_token de forma segura
    console.log('Novo refresh_token recebido');
  }
  console.log('Novo access_token recebido');
});

// Middleware para verificar e renovar tokens
const checkAndRefreshToken = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.body;
    
    if (!access_token) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    oauth2Client.setCredentials({
      access_token,
      refresh_token
    });

    // Verifica se o token está expirado
    const isExpired = oauth2Client.isTokenExpiring();
    if (isExpired && refresh_token) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      req.body.access_token = credentials.access_token;
      req.body.refresh_token = credentials.refresh_token || refresh_token;
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar a chave de API
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Chave de API não fornecida' });
  }

  if (apiKey !== process.env.GOOGLE_API_KEY) {
    return res.status(403).json({ error: 'Chave de API inválida' });
  }

  next();
};

// Aplicar o middleware em todas as rotas
app.use(checkApiKey);

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Rota para obter a URL de autenticação
app.get('/auth/google/url', (req, res) => {
  try {
    console.log('Gerando URL de autenticação...');
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const state = crypto.randomBytes(32).toString('hex');
    
    // Inicializa a sessão se não existir
    if (!req.session) {
      req.session = {};
    }
    
    req.session.state = state;
    console.log('Estado gerado:', state);

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: state,
      include_granted_scopes: true
    });

    console.log('URL gerada:', url);
    res.json({ url });
  } catch (error) {
    console.error('Erro ao gerar URL de autenticação:', error);
    res.status(500).json({ error: 'Falha ao gerar URL de autenticação', details: error.message });
  }
});

// Rota para trocar o código por tokens
app.post('/auth/google/tokens', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // Verifique o state para prevenir CSRF
    if (!state || state !== req.session.state) {
      return res.status(400).json({ error: 'State inválido' });
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    // Limpe o state após uso
    delete req.session.state;

    // Armazene os tokens de forma segura
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      token_type: tokens.token_type,
      scope: tokens.scope
    };

    res.json(tokenData);
  } catch (error) {
    console.error('Erro ao obter tokens:', error);
    res.status(500).json({ error: 'Falha ao obter tokens de acesso' });
  }
});

// Rota para renovar o token
app.post('/auth/google/refresh', checkAndRefreshToken, async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token não fornecido' });
    }

    oauth2Client.setCredentials({ refresh_token });
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    res.json({
      access_token: credentials.access_token,
      expires_in: credentials.expiry_date - Date.now(),
      token_type: credentials.token_type,
      scope: credentials.scope
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    res.status(500).json({ error: 'Falha ao renovar token de acesso' });
  }
});

// Rota para listar eventos
app.get('/calendar/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    const access_token = authHeader.split(' ')[1];
    if (!access_token) {
      return res.status(401).json({ error: 'Token de acesso inválido' });
    }

    const oauth2ClientTemp = new google.auth.OAuth2();
    oauth2ClientTemp.setCredentials({ access_token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2ClientTemp });
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime'
    });

    res.json(response.data.items || []);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    if (error.code === 401) {
      res.status(401).json({ error: 'Token de acesso inválido ou expirado' });
    } else {
      res.status(500).json({ error: 'Erro ao listar eventos do calendário' });
    }
  }
});

// Rota para criar evento
app.post('/calendar/events', async (req, res) => {
  try {
    const { event } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    const access_token = authHeader.split(' ')[1];
    if (!access_token) {
      return res.status(401).json({ error: 'Token de acesso inválido' });
    }

    const oauth2ClientTemp = new google.auth.OAuth2();
    oauth2ClientTemp.setCredentials({ access_token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2ClientTemp });
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    if (error.code === 401) {
      res.status(401).json({ error: 'Token de acesso inválido ou expirado' });
    } else {
      res.status(500).json({ error: 'Falha ao criar evento no Google Calendar' });
    }
  }
});

// Rota para deletar evento
app.delete('/calendar/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    const access_token = authHeader.split(' ')[1];
    if (!access_token) {
      return res.status(401).json({ error: 'Token de acesso inválido' });
    }

    const oauth2ClientTemp = new google.auth.OAuth2();
    oauth2ClientTemp.setCredentials({ access_token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2ClientTemp });
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    if (error.code === 401) {
      res.status(401).json({ error: 'Token de acesso inválido ou expirado' });
    } else {
      res.status(500).json({ error: 'Falha ao deletar evento do Google Calendar' });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 