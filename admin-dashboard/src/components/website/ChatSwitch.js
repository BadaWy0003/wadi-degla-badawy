import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Switch, Typography } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { toast } from 'react-toastify';
import apiClient from '../../util/client';

const API = '/api/chat/admin';

// "Chat assistant" on the Website page (Tools): switch the website's AI chat on or off (it takes
// effect within a minute) and see how much of the free Groq allowance is left today. The
// assistant itself runs on the server (server/src/services/chat.service.js).
export default function ChatSwitch() {
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await apiClient.get(API);
      setInfo(data.data);
      setError('');
    } catch (e) {
      setError(e?.response?.status === 403 ? 'Only an Admin or Owner can change this.' : "Couldn't load the chat status.");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const toggle = async on => {
    setBusy(true);
    try {
      const { data } = await apiClient.put(API, { enabled: on });
      setInfo(data.data);
      toast.success(on ? 'The chat assistant is on.' : 'The chat assistant is off. Visitors see the WhatsApp button instead.');
    } catch {
      toast.error("Couldn't change it. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const models = (info?.groq?.models || []).filter(m => m.limits?.requestsLeftToday != null);
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <ForumOutlinedIcon color="action" sx={{ mt: 0.5 }} />
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Typography sx={{ fontWeight: 600 }}>Chat assistant</Typography>
          <Typography variant="body2" color="text.secondary">
            The AI chat on the website (the round button bottom-right). It answers from the website's own data, never gives prices, and confirmed
            requests arrive in Enquiries marked "(chat)".
          </Typography>
          {error && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          {info && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {!info.configured && <Chip size="small" color="warning" label="No Groq key on the server" />}
              <Chip size="small" label={`Answers today: ${info.answeredToday ?? 0}`} />
              {models.map(m => (
                <Chip
                  key={m.model}
                  size="small"
                  variant="outlined"
                  label={`${m.model.split('/').pop()}: ${m.limits.requestsLeftToday} of ${m.limits.requestsPerDay} left today${m.resting ? ' (resting)' : ''}`}
                />
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {busy && <CircularProgress size={18} />}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {info?.enabled ? 'On' : 'Off'}
          </Typography>
          <Switch
            checked={Boolean(info?.enabled)}
            disabled={!info || busy}
            onChange={e => toggle(e.target.checked)}
            inputProps={{ 'aria-label': 'Chat assistant on or off' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
