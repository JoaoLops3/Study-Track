import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Rota para obter a URL de autenticação
app.get('/auth/google/url', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url });
});

// Rota para trocar o código por tokens
app.post('/auth/google/tokens', async (req, res) => {
  try {
    const { code } = req.body;
    const { tokens } = await oauth2Client.getToken(code);
    res.json(tokens);
  } catch (error) {
    console.error('Erro ao obter tokens:', error);
    res.status(500).json({ error: 'Falha ao obter tokens de acesso' });
  }
});

// Rota para renovar o token
app.post('/auth/google/refresh', async (req, res) => {
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