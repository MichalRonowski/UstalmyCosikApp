# Ustalmy Cosik App

Progressive Web App (PWA) z Firebase Firestore - działa webowo i mobilnie bez potrzeby instalacji pliku APK.

## 🚀 Technologie

- **React 18** - biblioteka UI
- **TypeScript** - typowanie
- **Vite** - szybki build tool
- **Firebase Firestore** - baza danych w chmurze
- **PWA** - Progressive Web App dla urządzeń mobilnych

## 📋 Wymagania

- Node.js (wersja 18 lub wyższa)
- npm lub yarn
- Konto Firebase

## 🔧 Konfiguracja Firebase

1. Przejdź do [Firebase Console](https://console.firebase.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Dodaj aplikację webową
4. Skopiuj konfigurację Firebase
5. Wklej ją do pliku `src/firebase/config.ts` zamiast placeholderów

### Firestore Database Setup

1. W Firebase Console przejdź do **Firestore Database**
2. Kliknij **Create database**
3. Wybierz **Start in test mode** (dla developmentu)
4. Wybierz lokalizację serwera (np. europe-west3)

## 📦 Instalacja

```bash
# Zainstaluj zależności
npm install
```

## 🏃‍♂️ Uruchomienie

```bash
# Tryb developerski
npm run dev

# Build produkcyjny
npm run build

# Podgląd buildu produkcyjnego
npm run preview
```

## 📱 Instalacja jako PWA

### Na urządzeniach mobilnych (Android/iOS):
1. Otwórz aplikację w przeglądarce (Chrome/Safari)
2. Kliknij opcję "Dodaj do ekranu głównego"
3. Aplikacja będzie działać jak natywna aplikacja

### Na desktopie:
1. Otwórz aplikację w Chrome
2. Kliknij ikonę instalacji w pasku adresu
3. Aplikacja otworzy się w osobnym oknie

## 🔥 Funkcjonalności

- ✅ Dodawanie wiadomości do Firestore
- ✅ Wyświetlanie wiadomości w czasie rzeczywistym
- ✅ Responsywny design (mobile & desktop)
- ✅ PWA - działa offline po pierwszym załadowaniu
- ✅ Instalowalna na urządzeniach mobilnych bez APK

## 🌐 Git & GitHub

```bash
# Inicjalizacja Git (jeśli jeszcze nie zrobione)
git init

# Dodaj wszystkie pliki
git add .

# Pierwszy commit
git commit -m "Initial commit: React + Vite + Firebase + PWA"

# Połącz z GitHub
git remote add origin https://github.com/TWOJA_NAZWA/UstalmyCosikApp.git
git branch -M main
git push -u origin main
```

## 📝 Struktura projektu

```
UstalmyCosikApp/
├── src/
│   ├── firebase/
│   │   └── config.ts       # Konfiguracja Firebase
│   ├── App.tsx             # Główny komponent
│   ├── App.css             # Style aplikacji
│   ├── main.tsx            # Entry point
│   └── index.css           # Globalne style
├── public/                 # Pliki statyczne
├── index.html              # HTML template
├── vite.config.ts          # Konfiguracja Vite + PWA
├── package.json            # Zależności
└── tsconfig.json           # Konfiguracja TypeScript
```

## 🛠️ Development

```bash
# Sprawdź błędy ESLint
npm run lint

# Zbuduj aplikację
npm run build
```

## 📄 Licencja

MIT
