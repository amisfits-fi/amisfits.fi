import type { InfoDocs } from './types'

// Selosteiden sisältö (englanti). Käännös suomenkielisestä (fi.ts): pidä sisällöt samoina.
const docs: InfoDocs = {
  privacy: {
    title: 'Privacy notice',
    updated: 'Updated 12 November 2026',
    sections: [
      { h: '', html: `
<p>This notice explains what data is processed about visitors to amisfits.fi and why. The site has no login and no forms, and you do not need to give any information about yourself to use it.</p>` },
      { h: 'Controller', html: `
<address>Sivistysala ry (Sivista), Finnish Education Employers<br>Eteläranta 10, FI-00130 Helsinki, Finland<br>Tel. +358 9 1728 5700<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a></address>
<p>Questions and requests about data protection can be sent to the email address above.</p>` },
      { h: 'What data is processed', html: `
<ul>
<li><strong>Technical delivery of the site.</strong> When you open a page, your browser sends the server your IP address, the time, the address of the requested page and information about your browser. This is needed to show the page and to keep the service secure. The site is hosted on Netlify's servers, and images and files from the content management system may be delivered from Sanity's servers.</li>
<li><strong>Visitor statistics, only with your consent.</strong> If you accept statistics cookies, we use Google Analytics. It collects information such as which pages are viewed, where visitors come from, which device and browser are used and the visitor's approximate region. The data is statistical and we cannot identify individual people from it. It is not used for advertising.</li>
<li><strong>The Amisfits test.</strong> Your answers are processed only in your own browser. They are not stored or sent anywhere. If you have accepted statistics cookies, the statistics record that the test was completed, together with the colour of the result, the page language and the audience (youth or adults). Individual answers are not recorded.</li>
<li><strong>Videos.</strong> Videos on the site are shown in an embedded YouTube player (youtube-nocookie.com). The player is loaded from Google's servers, so Google receives your IP address. When you start a video, YouTube may store data on your device and process viewing data under its own terms.</li>
</ul>` },
      { h: 'Cookies and browser storage', html: `
<ul>
<li><strong>Your cookie choice</strong> is saved in your browser's local storage (amisfits-suostumus) for 12 months, so that we do not ask on every visit. It stays on your device.</li>
<li><strong>Statistics cookies</strong> (_ga and cookies starting with _ga_) are set only if you accept them. They are kept for up to two years.</li>
</ul>
<p>You can change your choice at any time via the Cookie settings link at the bottom of the page. When you withdraw your consent, the statistics cookies are removed from your browser.</p>` },
      { h: 'Legal basis', html: `
<p>Technical delivery of the site and its security are based on the controller's legitimate interest. Visitor statistics and statistics cookies are based on your consent.</p>` },
      { h: 'Recipients and transfers outside the EU', html: `
<p>Data is processed on our behalf by the site's service providers: Netlify (hosting), Sanity (content management), Google (Analytics and YouTube) and the site's technical maintainer HueSky Oy. Some of these providers operate in the United States. Transfers are based on the EU–US Data Privacy Framework or the European Commission's standard contractual clauses. Data is not disclosed to anyone else.</p>` },
      { h: 'Retention', html: `
<p>Visitor-level data in Google Analytics is kept for up to 14 months. Server logs are kept for a limited time in line with the service provider's practice.</p>` },
      { h: 'Your rights', html: `
<p>You have the right to know whether data about you is processed, to ask for it to be corrected or erased or for processing to be restricted, and to object to processing. You can withdraw your consent at any time. Requests can be sent to <a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a>.</p>
<p>If you believe your data is being processed unlawfully, you can notify the Office of the Data Protection Ombudsman:</p>
<address>Office of the Data Protection Ombudsman<br>P.O. Box 800, FI-00531 Helsinki, Finland<br><a href="mailto:tietosuoja@om.fi">tietosuoja@om.fi</a>, switchboard +358 29 566 6700<br><a href="https://tietosuoja.fi/en">tietosuoja.fi/en</a></address>` },
    ],
  },

  accessibility: {
    title: 'Accessibility statement',
    updated: 'Prepared on 12 November 2026',
    sections: [
      { h: '', html: `
<p>This statement applies to the website amisfits.fi. The aim is for the site to meet the accessibility requirements of the Finnish Act on the Provision of Digital Services (306/2019), that is, levels A and AA of WCAG 2.1.</p>` },
      { h: 'Accessibility status', html: `
<p>The site partly meets the accessibility requirements. The known shortcomings are described below.</p>` },
      { h: 'Content that is not accessible', html: `
<ul>
<li><strong>Videos.</strong> The videos have burned-in subtitles but no audio description. The question titles and the interviewees' names appear only on screen, so they are not available to viewers with visual impairments (WCAG 1.2.5).</li>
<li><strong>Heading graphics.</strong> The main headings of the sections are images. They have text alternatives, but the appearance of the text cannot be changed with browser settings (WCAG 1.4.5).</li>
</ul>
<p>In addition, in the first section the heading level jumps from the main heading to the third level, which can make the page structure harder to follow with a screen reader. The embedded YouTube player is a third-party service whose accessibility we cannot control.</p>` },
      { h: 'How accessibility was assessed', html: `
<p>This is a self-assessment made by the developer of the site. The pages were checked on 2 November 2026 with the automated axe-core tool in all three languages. Keyboard use, contrast, text alternatives and the Amisfits test were also checked manually. Screen reader testing and an external audit have not been carried out.</p>` },
      { h: 'Did you notice a problem? Give us feedback', html: `
<p>If you notice an accessibility problem on the site or need the content in another format, please let us know:</p>
<address>Sivistysala ry (Sivista)<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a><br>Tel. +358 9 1728 5700</address>
<p>We will reply within 14 days.</p>` },
      { h: 'Supervisory authority', html: `
<p>If you are not satisfied with our reply or do not receive a reply within 14 days, you can report the matter to the supervisory authority. The authority's website explains how to make a report and how it is handled.</p>
<address>Finnish Transport and Communications Agency Traficom<br>Digital Accessibility Supervision Unit<br><a href="https://www.webaccessibility.fi">www.webaccessibility.fi</a><br><a href="mailto:saavutettavuus@traficom.fi">saavutettavuus@traficom.fi</a><br>Switchboard +358 29 534 5000</address>` },
    ],
  },
}

export default docs
