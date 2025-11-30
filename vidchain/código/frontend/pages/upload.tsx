import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; cid?: string } | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      setMessage({ type: 'error', text: 'Por favor, selecione um arquivo e informe um título' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const response = await fetch('http://localhost:8080/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ 
          type: 'success', 
          text: 'Vídeo enviado com sucesso!', 
          cid: data.fakeCid 
        });
        setFile(null);
        setTitle('');
        // Redirecionar para feed após 2 segundos
        setTimeout(() => {
          router.push('/feed');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Erro ao enviar vídeo. Tente novamente.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão. Verifique se o backend está rodando.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Upload de Vídeo</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <p><strong>Este CID simboliza que o vídeo não depende de um servidor central único.</strong></p>
        <p>Neste MVP, estamos simulando a lógica de conteúdo endereçado por hash.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Título do Vídeo
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do vídeo"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="file" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Arquivo de Vídeo
          </label>
          <input
            id="file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: uploading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {uploading ? 'Enviando...' : 'Enviar Vídeo'}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <p><strong>{message.text}</strong></p>
          {message.cid && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              CID: <code style={{ background: '#fff', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>{message.cid}</code>
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a 
          href="/feed" 
          style={{ color: '#0070f3', textDecoration: 'none' }}
        >
          Ver Feed →
        </a>
      </div>
    </div>
  );
}

