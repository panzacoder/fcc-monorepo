'use client'
import { View, Linking } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import PtsBackHeader from 'app/ui/PtsBackHeader'
export function PrivacyPolicyScreen() {
  const router = useRouter()
  let titleStyle = 'font-400 w-full text-[15px] text-[#1A1A1A] font-bold'
  let valueStyle = 'font-400 ml-1 w-[90%] text-[15px]  text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mx-5 my-2 w-full items-center">
        <Typography className={titleStyle}>{title}</Typography>
        <Typography className={valueStyle}>{value}</Typography>
      </View>
    )
  }
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }
  return (
    <View className="flex-1">
      <View className="mt-[25px]">
        <PtsBackHeader title="Privacy Policy" memberData={{}} />
      </View>
      <ScrollView className="mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[0.5px] border-gray-400">
        <Typography className="mt-[10px] text-center font-bold">
          {'Family Care Circle: Privacy Policy'}
        </Typography>
        {getDetailsView(
          '1. Overview',
          'Family Care Circle, LLC ("Company") is committed to protecting your privacy online. This Privacy Policy describes the personal information we collect through the Family Care Circle Application. Users of the application are referred to as "Members," "Family Members," and "Contacts," and Company is referred to as "we," "us," and "our." Family Care Circle refers to the users "Family Members" and "Contacts" of the "Member," in which the information is gathered for better care within the circle of users. Accessing the Family Care Circle application constitutes a use of the application and an acceptance of our Privacy Policy.\n\nWithin the application, we collect information about the healthcare of Members for use by the circle of users ("Family Members" and "Contacts") as approved by the Family Members designated as Administrator of the Family Care Circle. This information will be used to improve communication between "Family Members" and "Contacts" sharing care of the member and will only be available to the Members of the Family Care Circle.\n\nUse of the application, including all materials presented herein and all online Services provided by the Company, is subject to this Privacy Policy.'
        )}

        {getDetailsView(
          '2. Information We Collect',
          'This Site only collects the personal information you voluntarily provide to us, which includes your name, email, and phone number to facilitate communication between "Family Members" and "Contacts" within the circle of caregivers for the "Members."\n\n This Site also collects personal and medical appointment information you voluntarily provide as the Administrator or Caregiver of the Member. This includes the member name, email, phone number, medical appointments, and notes about the member to enhance communication and care sharing between "Family Members" and provide limited views to designated "Contacts."\n\nWe do share your information with trusted third parties who provide support in running this application, including product support. All parties will keep your information confidential and will never be shared with unrelated third parties.\n\nWe may record information relating to your use of the Application to help administer the Site and personalize your experience by improving customer service.\n\nAdditionally, we may send cookies to your phone or computer to identify your use of the application and improve our service. You may decline cookies in your Internet settings, but doing so may prevent you from using some of the application features.\n\nThis application may contain links to third-party services. Unless otherwise stated, this Privacy Policy only covers information that we collect from you within this application. Any other link will be covered by the privacy policy of that specific site. You acknowledge and accept that we are not responsible for the privacy policies or practices of third parties.'
        )}
        {getDetailsView(
          '3. Security',
          'We do our best to protect your information from unauthorized access, misuse, or disclosure. However, you acknowledge that the personal information you voluntarily share could be accessed or tampered with by a third party. You agree that we are not responsible for any intercepted information shared through our Application without our knowledge or permission. Additionally, you release us from any and all claims arising out of or related to the use of such intercepted information in any unauthorized manner. You agree to notify us of any breach of security or unauthorized use of your information.\n\nTo access or use the Application, you must be 18 years old or older and have the requisite power and authority to enter into this Privacy Policy. We do not knowingly collect or solicit data online from or market online to children under the age of 18.'
        )}
        {getDetailsView(
          '4. Data Retention',
          'We will retain your personal and medical information for as long as necessary to fulfill the purposes outlined in this Privacy Policy and as required by applicable laws. If you wish to request the deletion of your information, please contact us using the information provided in Section 6.  At any time, the Member or an Administrator can delete the member’s medical data within the application by selecting Delete Circle within the member’s profile option.'
        )}
        {getDetailsView(
          '5. Data Sharing and Disclosure',
          'We may share your personal and medical information in the following circumstances:\n\n5.1 With other "Family Members" and "Contacts" within the Family Care Circle to facilitate better care and communication for the "Member."\n\n5.2 With trusted third-party service providers who assist us in operating the application and providing support services. These service providers are bound by \n. strict confidentiality agreements and are prohibited from using your information for any other purpose. \n\n5.3 In response to legal requests or to comply with applicable laws, regulations, legal processes, or government inquiries.\n\n5.4 To protect the rights, privacy, safety, or property of Family Care Circle, its users, or the public.'
        )}
        {getDetailsView(
          '6. Contact Information',
          'If you have any questions, concerns, or requests regarding this Privacy Policy or the use of your personal information, please contact us at:\n\nFamily Care Circle, LLC\n101 Palafox Place, #285 \nPensacola, FL 32591\nsupport@FamilyCareCircle.com'
        )}
        {getDetailsView(
          '7. User Rights',
          'As a user of the Family Care Circle application, you have certain rights regarding your personal information:\n\n7.1 Right to Access: You may request access to the personal and medical information we hold about you and receive a copy of this data.\n\n7.2 Right to Rectification: You may request the correction of any inaccurate or incomplete information we have about you.\n\n7.3 Right to Erasure: You may request the deletion of your personal information under certain circumstances, such as when it is no longer necessary for the purposes for which it was collected.\n\n7.4 Right to Restriction: You may request the restriction of the processing of your personal information under certain circumstances, such as when the accuracy of the data is contested.\n\n7.5 Right to Data Portability: You may request the transfer of your personal information to another organization in a structured, commonly used, and machine-readable format.\n\n7.6 Right to Object: You have the right to object to the processing of your personal information for certain purposes, such as direct marketing.\n\n\nTo exercise any of these rights, please contact us using the information provided in Section 6. We will respond to your request within a reasonable timeframe.'
        )}
        {getDetailsView(
          '8. International Data Transfers',
          'Your personal and medical information may be processed and stored in countries outside your own. By using the Family Care Circle application, you consent to the transfer of your information to these countries, which may have different data protection laws than your country of residence.'
        )}
        {getDetailsView(
          '9. Governing Law',
          'This Privacy Policy shall be governed by and construed in accordance with the laws of Escambia County, Pensacola, Florida, without regard to its conflict of law principles.'
        )}
        {getDetailsView(
          '10. Changes to This Policy',
          'You acknowledge and agree that you have reviewed this Privacy Policy and that you will continue to review it to be aware of any modifications. Any changes to this Policy will be updated on this page.'
        )}
        {getDetailsView(
          '11. Compliant with Network Advertising Initiative (NAI)',
          'We use third-party advertising companies to serve ads when you visit our website. These companies may use aggregated information (not including your name, address, email address, or telephone number) about your visits to this and other websites to provide advertisements about goods and services of interest to you. If you would like more information about this practice and to know your choices about not having this information used by these companies, click here:'
        )}
        <Typography
          onPress={() => {
            Linking.openURL(
              `http://${getWebsite('https://optout.networkadvertising.org/?c=1')}`
            )
          }}
          className="text-primary mx-10 font-bold"
        >
          {'(https://optout.networkadvertising.org/?c=1)'}
        </Typography>
        {getDetailsView(
          '12. Cookies and Statistical Information',
          'Like many other websites, FamilyCareCircle.com uses "cookies" to facilitate automated activity, determine how visitors use our website, and determine which features to add to our website. If you instruct your browser to disable cookies, you will not be able to access FamilyCareCircle.com extensive database. The data we collect through cookies provides us with important non-personal information about how our site is used. This information may be shared with our advertisers, but only in aggregate form without revealing any personal information about you or any of our visitors.'
        )}
        {getDetailsView(
          '13. Acknowledgment',
          'This Privacy Policy applies to all site visitors, customers, and all other users of the application. By using the application, you agree to this Privacy Policy, without modification, and acknowledge reading it.'
        )}
      </ScrollView>
    </View>
  )
}
