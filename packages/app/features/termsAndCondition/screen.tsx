'use client'
import { View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
export function TermsAndConditonScreen() {
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
  return (
    <View className="flex-1">
      <View className="ml-5 mt-[40px] flex-row">
        <Feather
          className="mt-1"
          name={'arrow-left'}
          size={20}
          color={'black'}
          onPress={() => {
            router.back()
          }}
        />
        <Typography className=" flex-1 text-center text-lg font-bold">
          {'Terms and conditions'}
        </Typography>
      </View>
      <ScrollView>
        <Typography className="mt-[10px] text-center font-bold">
          {'Family Care Circle: Terms and Conditions'}
        </Typography>
        {getDetailsView(
          '1. Introduction and Acceptance',
          '1.1 Welcome to Family Care Circle, LLC ("Company"). These Terms and Conditions govern your use of the Family Care Circle Application (the "Application"). By accessing or using the Application, you agree to be bound by these Terms and Conditions. If you do not agree with these Terms and Conditions, please refrain from using the Application.'
        )}

        {getDetailsView(
          '2. Definitions',
          '2.1. "Application" refers to the Family Care Circle Application provided by Family Care Circle, LLC.\n2.2. "User," "You," or "Your" refers to any person who accesses or uses the Application.\n2.3. "Company," "We," "Us," or "Our" refers to Family Care Circle, LLC, the provider of the Application.'
        )}
        {getDetailsView(
          '3. License and Use',
          '3.1 Eligibility: By using the Family Care Circle application, you represent and warrant that you are 18 years of age or older and have the legal capacity to enter into these Terms and Conditions. If you are using the application on behalf of an organization, you further represent and warrant that you have the authority to bind that organization to these Terms and Conditions.\n3.2 License: Subject to these Terms and Conditions, the Company grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Application for personal and non-commercial purposes only. This license does not permit you to modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any content or information obtained from the Application.'
        )}
        {getDetailsView(
          '4. User Obligations',
          '4.1 Responsible Use: You agree to use the Application responsibly and not engage in any activity that may harm or disrupt the Application, its servers, or networks. You shall not use the Application for any unlawful, harmful, fraudulent, or unauthorized purposes.\n4.2 Account Security: You are responsible for maintaining the confidentiality of your account credentials and are liable for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.'
        )}
        {getDetailsView(
          '5. Information We Collect',
          'Our data collection and usage practices are governed by our Privacy Policy. By using the Application, you consent to the collection, storage, and use of your information as described in our Privacy Policy.'
        )}
        {getDetailsView(
          '6. Intellectual Property',
          '6.1 Ownership: All intellectual property rights, including trademarks, copyrights, and patents related to the Application, remain the exclusive property of Family Care Circle, LLC.\n6.2 Use of Content: You may not use, reproduce, distribute, or display any content from the Application without the express written permission of Family Care Circle, LLC.'
        )}
        {getDetailsView(
          '7. Disclaimers',
          '7.1 No Warranties: The Application is provided "as is" without warranties of any kind, express or implied. Family Care Circle, LLC makes no representations or warranties regarding the accuracy, reliability, or completeness of the Applications content or functionality.\n7.2 Medical Disclaimer: The Application is not intended to provide medical advice or replace professional medical care. It is solely for informational purposes. You should always consult with qualified healthcare professionals for any medical concerns.'
        )}
        {/* {getDetailsView('', '')} */}
        {getDetailsView(
          '8. Limitation of Liability',
          'To the maximum extent permitted by law, Family Care Circle, LLC shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Application or any information provided therein.'
        )}
        {getDetailsView(
          '9. Indemnification',
          'You agree to indemnify and hold Family Care Circle, LLC, its affiliates, officers, and employees harmless from any claims, losses, liabilities, or expenses (including attorneys fees) arising from your use of the Application or any violation of these Terms and Conditions.'
        )}
        {getDetailsView(
          '10. Termination',
          'Family Care Circle, LLC reserves the right to terminate your access to the Application at any time for any reason, including, but not limited to, violation of these Terms and Conditions.'
        )}
        {getDetailsView(
          '11. Modifications to the Terms and Software',
          'Family Care Circle, LLC may modify these Terms and Conditions or the Applications features at any time. We will notify you of any material changes through the Application or by other means. Your continued use of the Application after such modifications constitutes acceptance of the updated Terms and Conditions.'
        )}
        {getDetailsView(
          '12. Governing Law and Jurisdiction',
          'These Terms and Conditions shall be governed by and construed in accordance with the laws in the State of Florida, without regard to its conflict of law principles. Any disputes arising from or related to these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in the State of Florida.'
        )}
        {getDetailsView(
          '13. Miscellaneous',
          '13.1 Severability: If any provision of these Terms and Conditions is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.\n13.2 Entire Agreement: These Terms and Conditions constitute the entire agreement between you and Family Care Circle, LLC, and supersede any prior agreements, oral or written, between you and the Company.'
        )}
      </ScrollView>
    </View>
  )
}
