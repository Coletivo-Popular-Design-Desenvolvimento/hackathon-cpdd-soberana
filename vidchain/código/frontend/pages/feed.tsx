import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  fakeCid: string;
  localUrl: string;
  author: string;
  createdAt: string;
}

export default function Feed() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/videos/feed');
      
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
        setError(null);
      } else {
        setError('Erro ao carregar feed');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <p>Carregando feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1>Feed de Vídeos</h1>
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          <p><strong>Erro:</strong> {error}</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/upload" style={{ color: '#0070f3', textDecoration: 'none' }}>
            ← Voltar para Upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Feed de Vídeos</h1>
        <Link 
          href="/upload"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          + Novo Vídeo
        </Link>
      </div>

      {videos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Nenhum vídeo ainda.</p>
          <Link 
            href="/upload"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Fazer primeiro upload
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {videos.map((video) => (
            <div 
              key={video.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <video
                src={`http://localhost:8080${video.localUrl}`}
                controls
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#000'
                }}
              />
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {video.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Autor:</strong> {video.author}
                  </p>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>CID:</strong>{' '}
                    <code style={{
                      background: '#f5f5f5',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '3px',
                      fontSize: '0.8rem',
                      wordBreak: 'break-all'
                    }}>
                      {video.fakeCid}
                    </code>
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.75rem' }}>
                    {new Date(video.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

