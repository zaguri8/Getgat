import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FirebaseContextProvider, Maybe } from './firebase/context';
import { createContext, FunctionComponent, useContext, useState } from 'react';
import { HashRouter } from 'react-router-dom';

export type Action<T> = (a: T) => void
export interface iModal {
  show: Action<React.ReactNode>
  close: () => void,
  content: Maybe<React.ReactNode>
}
const ModalContext = createContext<iModal | null>(null)

export const ModalContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [content, setContent] = useState<Maybe<React.ReactNode>>()

  const show = (content: React.ReactNode) => {
    setContent(content)
  }
  const close = () => {
    setContent(null)
  }
  return <ModalContext.Provider value={{ content, show, close }}>
    {children}
  </ModalContext.Provider>
}
export const useModal = () => useContext(ModalContext) as iModal
export const profilepicDef = "https://firebasestorage.googleapis.com/v0/b/getgat-web.appspot.com/o/profile.jpg?alt=media&token=5d97f29b-ec05-4151-80b4-1bda93a16984"
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<FirebaseContextProvider>
  <ModalContextProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ModalContextProvider>
</FirebaseContextProvider>);

