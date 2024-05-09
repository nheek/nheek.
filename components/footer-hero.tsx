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
      <section className="px-4 pt-[25%] md:pt-[15%] min-h-max h-[30vh] sm:h-[40vh] md:min-h-[50vh] md:h-[40vh]">
          <hgroup className="text-4xl md:text-[4rem] xl:text-[6rem]">
            {textsMap.txtFooterHero}
          </hgroup>
          <div className="w-[90%] text-lg md:text-3xl leading-snug text-right mt-6 md:mt-10 mx-auto">
          {textsMap.txtFooterContent}
          </div>
      </section>
      <ContactForm />
    </>
  );
}