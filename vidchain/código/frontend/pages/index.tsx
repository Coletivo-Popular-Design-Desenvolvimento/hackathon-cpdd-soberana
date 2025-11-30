import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          VidChain
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}>
          Rede de vídeos curtos P2P - VidChain
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/upload" style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            📤 Enviar Vídeo
          </Link>
          
          <Link href="/feed" style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid white',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            📺 Ver Feed
          </Link>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            <strong>VidChain</strong> é um protótipo de rede social de vídeos curtos
            construída com tecnologias livres e distribuídas.
          </p>
          <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>
            • Armazenamento via <strong>IPFS</strong> (P2P)
          </p>
          <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>
            • Registro via <strong>Blockchain</strong> (imutável)
          </p>
          <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>
            • <strong>Soberania digital</strong> e cooperação popular
          </p>
        </div>
      </div>
    </div>
  );
}

