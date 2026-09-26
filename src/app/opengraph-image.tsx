import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/constants';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
          fontFamily: 'sans-serif'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 24,
            background: '#4f46e5',
            color: 'white',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 32
          }}
        >
          P
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, color: '#0f172a' }}>{SITE.name}</div>
        <div style={{ fontSize: 28, color: '#475569', marginTop: 16 }}>{SITE.slogan}</div>
      </div>
    ),
    size
  );
}
