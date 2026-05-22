import ContactForm from '../../components/ui/ContactForm';

/**
 * @typedef {import("@prismicio/client").Content.ContactSlice} ContactSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ContactSlice>} ContactProps
 * @type {import("react").FC<ContactProps>}
 */
const Contact = ({ slice }) => {
  const { primary } = slice;

  return (
    <section
      id="contact"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8 md:py-16 px-2"
    >
      <div className="max-w-2xl mx-auto">
        <ContactForm
          contactName={primary.name || 'Your Name'}
          subject={primary.subject || 'Subject'}
          contactMessage="Your Message"
          submitText={primary.submit_button_name || 'Send Message'}
          successMessage={primary.contact_success_message || 'Message sent successfully!'}
          failureMessage={primary.contact_error_message || 'Failed to send message. Please try again.'}
        />
      </div>
    </section>
  );
};

export default Contact;
