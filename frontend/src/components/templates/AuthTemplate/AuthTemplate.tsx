import React from 'react';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        padding: '20px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" align="center" color="textSecondary" style={{ marginBottom: '24px' }}>
            {subtitle}
          </Typography>
        )}
        {children}
        {footer && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
};
