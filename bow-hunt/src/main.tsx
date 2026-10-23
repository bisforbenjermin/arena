import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { AdminApp } from './ui/AdminApp';
import { ContestApp } from './ui/ContestApp';
import './ui/styles.css';

const view = new URLSearchParams(window.location.search).get('view');
const root = view === 'free' ? <App /> : view === 'admin' ? <AdminApp /> : <ContestApp />;

createRoot(document.getElementById('root')!).render(root);
