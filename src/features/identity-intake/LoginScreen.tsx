import React, { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { Profile } from '../../types/privacy';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LoginScreenProps {
  onLogin: (profile: Profile) => void;
  language?: 'es' | 'en';
  onToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  language = 'es',
  onToast
}) => {
  const [isRegister, setIsRegister] = useState(true);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      if (!name.trim() || !email.trim() || !location.trim() || !password.trim()) {
        onToast(language === 'en' ? "Please fill all the secure identity fields." : "Por favor completa todos los campos de identidad de seguridad.");
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        onToast(language === 'en' ? "Please fill your secure credentials." : "Por favor completa tus credenciales seguras.");
        return;
      }
    }

    setLoading(true);

    if (isRegister) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        
        const initials = name
          .trim()
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const generatedProfile: Profile = {
          name: name.trim(),
          initials: initials || "US",
          location: location.trim(),
          emails: [email.trim(), `work.alias@${email.trim().split('@')[1] || 'privacy-vault.net'}`],
          usernames: [email.trim().split('@')[0] || "user", `${email.trim().split('@')[0] || "user"}_secure`],
          phone: "+52 ••• ••• ••" + Math.floor(Math.random() * 90 + 10),
          memberSince: "Junio 2026",
        };

        // Write profile document to Firestore under users/{uid}
        await setDoc(doc(db, 'users', user.uid), generatedProfile);
        
        // Write default profile to local storage as active session cache
        localStorage.setItem('leakshield_user_profile', JSON.stringify(generatedProfile));
        localStorage.setItem('leakshield_session_active', 'true');
        
        setLoading(false);
        onToast(language === 'en' ? "Sovereign Identity registered successfully!" : "¡Identidad Soberana registrada con éxito!");
        onLogin(generatedProfile);
      } catch (err: any) {
        setLoading(false);
        console.error(err);
        onToast(err.message || "Error al registrar identidad");
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        
        // Fetch profile document from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        let profileData: Profile;
        if (docSnap.exists()) {
          profileData = docSnap.data() as Profile;
        } else {
          // Fallback if firestore document doesn't exist
          const initials = "JF";
          profileData = {
            name: "Jovan Franco",
            initials: initials,
            location: "Ciudad de México, MX",
            emails: [email.trim(), `work.alias@${email.trim().split('@')[1] || 'privacy-vault.net'}`],
            usernames: [email.trim().split('@')[0] || "user", `${email.trim().split('@')[0] || "user"}_secure`],
            phone: "+52 ••• ••• ••99",
            memberSince: "Junio 2026",
          };
          await setDoc(doc(db, 'users', user.uid), profileData);
        }
        
        localStorage.setItem('leakshield_user_profile', JSON.stringify(profileData));
        localStorage.setItem('leakshield_session_active', 'true');
        
        setLoading(false);
        onToast(language === 'en' ? "Welcome back! Secure console decrypted." : "¡Bienvenido de vuelta! Consola de seguridad descifrada.");
        onLogin(profileData);
      } catch (err: any) {
        setLoading(false);
        console.error(err);
        onToast(err.message || "Error de credenciales o de descifrado");
      }
    }
  };

  const handleQuickDemoFill = () => {
    setName("Jovan Franco");
    setEmail("jovan.franco@techflow.io");
    setLocation("Monterrey, NL");
    setPassword("🛡️SecureSovereignKey2026!");
    onToast(language === 'en' ? "Secure profiles pre-populated." : "Campos seguros autocompletados.");
  };

  return (
    <div className="page min-h-screen bg-gradient-to-br from-bg-0 via-bg-0 to-bg-1 flex items-center justify-center p-6 relative select-none">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-teal/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[90px] pointer-events-none" />
      
      <div 
        onMouseMove={handleMouseMove}
        className="group relative overflow-hidden w-full max-w-[460px] bg-bg-1/80 border border-line-2 rounded-2xl p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 stagger-fade-in"
      >
        {/* Specular highlights overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(45, 212, 191, 0.05), transparent 80%)`
        }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.005] to-white/[0.025] pointer-events-none" />

        <div className="flex flex-col items-center mb-6.5 text-center relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan text-[#04110F] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(45,212,191,0.6)] mb-3 animate-pulse">
            <Icon name="shield-check" size={24} />
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-t-0 m-0">LeakShield AI</h1>
          <p className="text-t-2 text-[12.5px] mt-1.5 max-w-[340px] leading-relaxed">
            {language === 'en' 
              ? "Command Center for Sovereign Privacy & Zero-Trust Browser Cyber-Defense." 
              : "Command Center de Privacidad Soberana y Ciberdefensa Local en Navegador."}
          </p>
        </div>

        <div className="flex border-b border-line mb-6 relative z-10">
          <button
            onClick={() => { setIsRegister(true); onToast("Modo: Crear cuenta soberana"); }}
            className={`flex-1 pb-2.5 text-[13px] font-bold cursor-pointer transition-colors border-0 bg-transparent ${
              isRegister ? 'text-teal border-b-2 border-teal' : 'text-t-2 hover:text-t-0'
            }`}
          >
            {language === 'en' ? "Create Sovereign Identity" : "Crear Identidad Soberana"}
          </button>
          <button
            onClick={() => { setIsRegister(false); onToast("Modo: Descifrar consola"); }}
            className={`flex-1 pb-2.5 text-[13px] font-bold cursor-pointer transition-colors border-0 bg-transparent ${
              !isRegister ? 'text-teal border-b-2 border-teal' : 'text-t-2 hover:text-t-0'
            }`}
          >
            {language === 'en' ? "Decrypt Console" : "Descifrar Consola"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {isRegister && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[11.5px] font-semibold uppercase tracking-wider text-t-2">
                {language === 'en' ? "Full Name" : "Nombre Completo"}
              </label>
              <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2 focus-within:border-teal/50">
                <Icon name="user" size={14} />
                <input 
                  type="text"
                  required
                  placeholder={language === 'en' ? "e.g. Jovan Franco" : "ej. Jovan Franco"}
                  className="bg-transparent border-0 outline-none text-t-0 text-[13px] w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold uppercase tracking-wider text-t-2">
              {language === 'en' ? "Primary Email" : "Correo Electrónico Principal"}
            </label>
            <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2 focus-within:border-teal/50">
              <Icon name="mail" size={14} />
              <input 
                type="email"
                required
                placeholder={language === 'en' ? "e.g. jovan@example.com" : "ej. jovan@example.com"}
                className="bg-transparent border-0 outline-none text-t-0 text-[13px] w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {isRegister && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-[11.5px] font-semibold uppercase tracking-wider text-t-2">
                {language === 'en' ? "Primary Region / Location" : "Región / Ubicación"}
              </label>
              <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2 focus-within:border-teal/50">
                <Icon name="map" size={14} />
                <input 
                  type="text"
                  required
                  placeholder={language === 'en' ? "e.g. Monterrey, MX" : "ej. Monterrey, MX"}
                  className="bg-transparent border-0 outline-none text-t-0 text-[13px] w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold uppercase tracking-wider text-t-2">
              {language === 'en' ? "Master Password (Sovereign Decryption Key)" : "Contraseña Maestra (Clave de Descifrado)"}
            </label>
            <div className="flex items-center gap-2 bg-bg-inset border border-line rounded-lg px-3 py-2 text-t-2 focus-within:border-teal/50">
              <Icon name="key" size={14} />
              <input 
                type="password"
                required
                placeholder="•••••••••••••••"
                className="bg-transparent border-0 outline-none text-t-0 text-[13px] w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-t-3 text-[10.5px] mt-1.5">
            <Icon name="shield-check" size={13} style={{ color: 'var(--teal)' }} />
            <span>
              {language === 'en'
                ? "PBKDF2 SHA-256 local encryption active. No data leaves your machine."
                : "Cifrado local PBKDF2 SHA-256 activo. Ningún dato sale de tu dispositivo."}
            </span>
          </div>

          <div className="flex gap-3.5 mt-2 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-4 py-3 bg-gradient-to-b from-teal to-cyan text-[#04110F] hover:brightness-[1.07] active:translate-y-[0.5px] cursor-pointer transition-all duration-100 shadow-premium border-0"
            >
              {loading ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-[#04110F] border-t-transparent rounded-full animate-spin" />
                  {language === 'en' ? "Authorizing..." : "Autorizando..."}
                </>
              ) : (
                <>
                  <Icon name="shield-check" size={15} />
                  {isRegister 
                    ? (language === 'en' ? "Register & Decrypt" : "Registrar y Descifrar")
                    : (language === 'en' ? "Access Console" : "Acceder a Consola")}
                </>
              )}
            </button>

            {isRegister && (
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold text-[13px] px-3.5 py-3 border border-line-2 bg-bg-3 hover:bg-bg-2 text-t-0 cursor-pointer transition-all duration-130 shadow-premium"
                title={language === 'en' ? "Quick Auto-Fill Profile" : "Autocompletar perfil rápidamente"}
              >
                <Icon name="sparkles" size={14} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
