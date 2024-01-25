import ContactForm from '../components/contact-form';
import getTextsMap from '../components/get-texts-map';

export default function FooterHero() {
  const wwwNheekNo = {
    txtFooterHero: 'ta kontakt',
    txtFooterContent: 'jeg tror at det å anvende brukervennlig og likevel tiltalende design er veien å gå. enig? ta kontakt nå.',
  };
  
  const wwwDefault = {
    txtFooterHero: 'get in touch',
    txtFooterContent: 'i believe that incorporating user-friendly and yet appealing design is the way to go. agree? reach out below.',
  };
  
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

  return (
    <>
      <div className="px-6 pt-[25%] md:pt-[15%] min-h-max h-[60vh] md:h-[70vh]">
          <section className="text-6xl md:text-[6rem] xl:text-[10rem]">
            {textsMap.txtFooterHero}
          </section>
          <section className="text-lg md:text-3xl leading-snug w-[90%] text-right mx-auto">
          {textsMap.txtFooterContent}
          </section>
      </div>
      <ContactForm />
    </>
  );
}