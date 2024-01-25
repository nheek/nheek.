import { useEffect, useState } from 'react';
import getCurrentDomain from '../components/get-current-domain';

export default function ContactForm() {
  const [inputFields, setInputFields] = useState([]);
  const [txtContactMessage, setTxtContactMessage] = useState('');
  const [txtLoading, setTxtLoading] = useState([]);
  const inputFieldsMap = {
    'www.nheek.no': ['navn', 'epost', 'emne'],
    default: ['name', 'email', 'subject']
  };
  const txtContactMessageMap = {
    'www.nheek.no': 'skriv meldingen din her',
    default: 'type your message here'
  };
  const txtLoadingMap = {
    'www.nheek.no': ['sender inn...', 'send inn'],
    default: ['submitting...', 'submit']
  };
  
  useEffect(() => {
    const domain = getCurrentDomain();
    setInputFields(inputFieldsMap[domain] || inputFieldsMap.default);
    setTxtContactMessage(txtContactMessageMap[domain] || txtContactMessageMap.default);
    setTxtLoading(txtLoadingMap[domain] || txtLoadingMap.default);
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => (
      { ...prev, [e.target.name]: e.target.value }
    ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/submit-contact-form',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      const result = await response.json();

      setSubmissionResult({ success: response.ok, message: result.message || result.error || 'An error occurred during form submission.' });
    } catch (error) {
      console.error('Error sending form data:', error);
      setSubmissionResult({ success: false, message: 'An error occurred during form submission.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="px-6 min-h-max h-[50vh]">
      <form className="h-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-[5%]" onSubmit={handleSubmit}>
        <section className="w-full md:w-[40%] h-full flex flex-col justify-center gap-[6%] md:gap-[5%] text-lg">
          {inputFields.map((field) => (
            <input
              key={field}
              className="h-[25%] rounded-xl md:rounded-3xl pl-4 text-gray-900"
              type={field in ['email', 'epost'] ? 'email' : 'text'}
              name={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
        </section>
        <section className="w-full md:w-[40%] h-full flex flex-col md:justify-center gap-[6%] md:gap-[5%] text-lg">
          <textarea
            className="rounded-xl md:rounded-3xl pl-4 h-[60%] pt-5 text-gray-900"
            name="message"
            placeholder={txtContactMessage}
            value={formData.message}
            onChange={handleChange}
          />
          <button
            className="border-2 border-solid border-gray-200 p-4 rounded-xl md:rounded-3xl hover:bg-gray-200 hover:text-black duration-500"
            type="submit"
            disabled={loading}
          >
            {loading ? txtLoading[0] : txtLoading[1]}
          </button>
        </section>
      </form>

      {submissionResult && (
        <div className={`${submissionResult.success ? 'text-green-800' : 'text-red-800'} bg-gray-200 w-fit m-auto px-4 py-1 rounded-3xl mt-4 md:mt-0`}>
          {submissionResult.message}
        </div>
      )}
    </div>
  );
}
