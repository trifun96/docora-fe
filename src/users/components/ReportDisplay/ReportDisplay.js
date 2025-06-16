import React, { useCallback, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { sendReport } from '../../../api/api';
import { toast } from 'react-toastify';

pdfMake.vfs = pdfFonts.vfs;

const ReportDisplay = React.memo(({ report, email, patientData, clearReport, profile}) => {
  const [loading, setLoading] = useState(false);
  console.log(profile,'profile');
  

  const generateAndSendPdf = useCallback(() => {
    if (!email || !email.includes('@')) {
      toast.warning('Email adresa nije validna.', {
        toastId: 'invalid-email',
      });
      return;
    }

    const cleanedReport = report
      .replace(/Potpis lekara:.*(\r?\n)?/gi, '')
      .replace(/Potpis:.*(\r?\n)?/gi, '')
      .replace(/Dr\.?\s+[^\n]+(\r?\n)?/gi, '')
      .replace(/Prim\.?\s+[^\n]+(\r?\n)?/gi, '')
      .replace(/Prof\.?\s+[^\n]+(\r?\n)?/gi, '')
      .replace(/Specijalista.*(\r?\n)?/gi, '')
      .replace(/Lekar specijalista.*(\r?\n)?/gi, '')
      .replace(/Medicinski izveštaj:.*(\r?\n)?/gi, '')
      .replace(/Izveštaj:.*(\r?\n)?/gi, '')
      .replace(/Stomatološki:.*(\r?\n)?/gi, '')
      .replace(/Izveštaj o stomatološkom pregledu:.*(\r?\n)?/gi, '')
      .replace(/S poštovanjem,?(\r?\n)?/gi, '')
      .replace(/(Srdačan|Srdačno)?\s*Pozdrav,?(\r?\n)?/gi, '')
      .replace(/Lep pozdrav,?(\r?\n)?/gi, '')
      .replace(/Hvala na poverenju\.?(\r?\n)?/gi, '')
      .replace(/Datum pregleda:.*(\r?\n)?/gi, '')
      .replace(/Datum:.*(\r?\n)?/gi, '')
      .replace(/Vreme:.*(\r?\n)?/gi, '')
      .replace(/Datu[mn]\s+generisan[oa]:?.*(\r?\n)?/gi, '')
      .replace(/Napomena:.*(\r?\n)?/gi, '')
      .replace(/Web:.*(\r?\n)?/gi, '')
      .replace(/Ovaj izveštaj je generisan.*(\r?\n)?/gi, '')
      .replace(/Generisano pomoću.*(\r?\n)?/gi, '')
      .replace(/AI model.*(\r?\n)?/gi, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

const docDefinition = {
  content: [
    {
      text: `${profile.clinic}`,
      style: 'mainHeader',
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 1,
          lineColor: '#007ACC',
        },
      ],
      margin: [0, 5, 0, 20],
    },
    {
      text: `${profile.address}`,
      style: 'subHeader',
    },
    {
      style: 'patientInfoBox',
      table: {
        widths: ['30%', '70%'],
        body: [
          ['Ime:', patientData.ime || ''],
          ['Prezime:', patientData.prezime || ''],
          ['Datum rođenja:', patientData.datumRodjenja || ''],
          ['Telefon:', patientData.telefon || ''],
          ['Email:', patientData.email || ''],
          ['Datum kontrole:', patientData.kontrola || ''],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingTop: () => 4,
        paddingBottom: () => 4,
        paddingLeft: () => 0,
        paddingRight: () => 0,
      },
    },
    {
      text: 'Izveštaj o pregledu',
      style: 'sectionTitle',
      margin: [0, 30, 0, 10],
    },
    {
      text: cleanedReport,
      style: 'reportContent',
    },
  ],
  styles: {
    mainHeader: {
      fontSize: 22,
      bold: true,
      alignment: 'center',
      color: '#007ACC',
      margin: [0, 0, 0, 4],
    },
    subHeader: {
      fontSize: 12,
      alignment: 'center',
      italics: true,
      margin: [0, 0, 0, 20],
    },
    sectionTitle: {
      fontSize: 14,
      bold: true,
      decoration: 'underline',
    },
    reportContent: {
      fontSize: 12,
      lineHeight: 1.6,
    },
    footerInfo: {
      fontSize: 10,
      italics: true,
    },
    patientInfoBox: {
      margin: [0, 10, 0, 10],
      fontSize: 11,
      fillColor: '#f3f6f9',
      color: '#333',
    },
  },
  footer: function (currentPage, pageCount) {
    return {
      columns: [
        {
          text: `Datum: ${new Date().toLocaleDateString()}`,
          style: 'footerInfo',
          alignment: 'left',
        },
        {
          text: `Lekar specijalista: ${profile.name}`,
          style: 'footerInfo',
          alignment: 'right',
        },
      ],
      margin: [40, 0, 40, 20], // levo, gore, desno, dole
    };
  },
  pageMargins: [40, 40, 40, 60],
};


    setLoading(true);

    pdfMake.createPdf(docDefinition).getBlob(async (blob) => {
      try {
        await sendReport(email, blob);
        toast.success('Izveštaj je uspešno poslat na mejl!', {
          toastId: 'report-sent',
        });
        clearReport();
      } catch (error) {
        console.error('Greška pri slanju mejla:', error);
        toast.error('Došlo je do greške prilikom slanja mejla.', {
          toastId: 'report-error',
        });
      } finally {
        setLoading(false);
      }
    });
  }, [report, email, patientData, clearReport]);

  return (
    <>
      {report && (
        <div style={{ marginTop: 20 }}>
          <h2>Generisani izveštaj</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: '#f5f5f5',
              padding: 10,
              maxHeight: 300,
              overflowY: 'auto',
              borderRadius: 4,
            }}
          >
            {report}
          </pre>
          <button
            onClick={generateAndSendPdf}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? 'Šaljem...' : 'Pošalji PDF na mejl'}
          </button>
        </div>
      )}
    </>
  );
});

export default ReportDisplay;
