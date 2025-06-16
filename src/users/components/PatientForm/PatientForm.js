import React, { useState, useRef, useEffect } from "react";
import "./PatientFrom.css";
import DatePicker from "react-datepicker";
import { generateReport } from "../../../api/api";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../Header/Header";
import { Button, Grid } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { toast } from "react-toastify";

export default function PatientForm({
  onGenerateReport,
  onEmailChange,
  onPatientDataFilled,
}) {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [telefon, setTelefon] = useState("");
  const [datumRodjenja, setDatumRodjenja] = useState(null);
  const [kontrola, setDatumKontrola] = useState(null);
  const [email, setEmail] = useState("");
  const [opis, setOpis] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Ovaj pretraživač ne podržava prepoznavanje govora.");
      return;
    }
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "sr-RS";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          finalTranscript = formatSpeechText(finalTranscript);
          setOpis((prev) =>
            prev ? prev + " " + finalTranscript : finalTranscript
          );
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Greška u prepoznavanju govora:", event.error);
        setError("Greška u prepoznavanju govora: " + event.error);
        setListening(false);
        recognitionRef.current.stop();
      };

      recognitionRef.current.onend = () => {
        setListening(false);
        setOpis((prev) => {
          if (!prev) return prev;
          if (!/[.?!]$/.test(prev.trim())) {
            return prev.trim() + ".";
          }
          return prev;
        });
      };
    }
  }, []);

  const formatSpeechText = (text) => {
    let formatted = text
      .replace(/\btačka\b/gi, ".")
      .replace(/\bzarez\b/gi, ",")
      .replace(/\buzvičnik\b/gi, "!")
      .replace(/\bznak pitanja\b/gi, "?")
      .replace(/\s+/g, " ")
      .replace(/\s([,.!?])/g, "$1")
      .trim()
      .split(/(?<=[.?!])\s+/)
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join(" ");
    return formatted;
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      toast.error("Vaš pretraživač ne podržava prepoznavanje govora.");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setError(null);
      recognition.start();
      setListening(true);
    }
  };

  const formatDatumKontrole = (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date)) return "";
    return new Intl.DateTimeFormat("sr-RS").format(dateObj);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validateEmail(email)) {
      setError("Molimo unesite validnu email adresu.");
      return;
    }

    setLoading(true);
    setError(null);

    const patientData = {
      ime,
      prezime,
      telefon,
      datumRodjenja: formatDatumKontrole(datumRodjenja),
      kontrola: formatDatumKontrole(kontrola),
      email,
      opis,
    };

    const fullPrompt = `
⚠️ Strogo pravilo:
🚫 NEMOJ koristiti uvodne rečenice, izmišljene zaključke, naslove koji nisu eksplicitno izgovoreni u tekstu ispod.

✅ DOZVOLJENO je:
- Ako tekst sadrži više celina (nalaz, terapija, preporuka itd.), slobodno ih razdvoji u odvojene sekcije sa odgovarajućim naslovima:
NALAZ:
TERAPIJA:
PREPORUKE:
LEČENJE:
- Ako ovakve informacije nisu jasno izdvojene u tekstu, nemoj ih dodavati.

📌 Prilikom razdvajanja:
- Koristi naslove samo ako ih možeš direktno izvući iz konteksta teksta.
- Ako je tekst samo jedna celina – ne razdvajaj ništa.
- ✍️ NEMOJ koristiti nabrajanja sa crtama (-), brojevima (1. 2. 3.) ili zvezdicama (*). Piši rečenice jednu ispod druge kao normalan tekst.

❗ZABRANJENO je:
- izmišljanje kategorija ako nisu očigledne
- dodavanje uvodnih rečenica poput: „Pacijent se javlja zbog...”, „Tokom pregleda...”, „Preporuka je...”

🔒 Tekst mora ostati veran originalu. Ispravljaj samo gramatičke i pravopisne greške.

📝 Tekst za obradu:
${opis}
`;


    try {
      const report = await generateReport(fullPrompt);
      onGenerateReport(report);

      // Dodatne akcije ako treba
      if (onEmailChange) onEmailChange(email);
      if (onPatientDataFilled) onPatientDataFilled(patientData);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message ||
          "Greška prilikom generisanja izveštaja. Pokušaj ponovo kasnije."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIme("");
    setPrezime("");
    setTelefon("");
    setDatumRodjenja(null);
    setDatumKontrola(null);
    setEmail("");
    setOpis("");
  };

  return (
    <>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="patient-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <input
              placeholder="Ime"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              required
            />
            <input
              placeholder="Prezime"
              value={prezime}
              onChange={(e) => setPrezime(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <input
              placeholder="Telefon"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <DatePicker
                selected={datumRodjenja}
                onChange={(date) => setDatumRodjenja(date)}
                placeholderText="Datum rođenja"
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                className="datepicker-input"
              />
            </div>
            <div className="form-group">
              <DatePicker
                selected={kontrola}
                onChange={(date) => setDatumKontrola(date)}
                placeholderText="Kontrola"
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                className="datepicker-input"
              />
            </div>
          </div>

          <div className="form-row">
            <textarea
              placeholder="Opis ili napomene"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              required
              rows={6}
            />
          </div>

          <div className="form-row button-row">
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="info"
                style={{ backgroundColor: "white", color: "blue" }}
                startIcon={listening ? <MicOffIcon /> : <MicIcon />}
                onClick={toggleListening}
                fullWidth
              >
                {listening ? "Zaustavi snimanje" : "Govori"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                fullWidth
              >
                {loading ? "Generišem..." : "Generiši izveštaj"}
              </Button>
            </Grid>
          </div>
        </form>
      </div>
    </>
  );
}
