import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Award, Handshake, Globe, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/translations';
import janeyu from '../../public/janeyu.png'
import office from '../../public/office.png'
import durga from '../../public/durga.png'
import laxmikub from '../../public/laxmikub.png'
import mangal from '../../public/mangal.png'
import kumbh from '../../public/kumbh.png'
import gopal from '../../public/gopal.png'
import narayanbali from '../../public/narayanbali.png'
import bhagwat from '../../public/bhagwat.png'
import vivah from '../../public/vivah.png'
import grah from '../../public/grah.png'
import satya from '../../public/satya.png'
import ganpati from '../../public/ganpati.png'
import guru from '../../public/guru.png'
import sarp from '../../public/sarp.jpg'
import kaal from '../../public/kaal.png'
import navdurga from '../../public/navdurga.png'
import sundar from '../../public/sundar.png'

const poojaBannerUrl = 'https://www.mahakaalprasad.com/cdn/shop/collections/pooja-path-10_1200x1200.webp?v=1716275840';
const shivrudra = 'https://i.pinimg.com/736x/7f/77/12/7f771216119e51cedc012e3f3a992b48.jpg';
const mahalaxmi = 'https://i.pinimg.com/736x/c2/c2/98/c2c298ae7cee38afc4bcbeb71bd46181.jpg';
const naamkaran= 'https://cdn.99pandit.com/images/blogsimg/Pandit%20For%20Namkaran%20Puja%203.webp';
const chandi= 'https://i.pinimg.com/736x/58/07/42/580742921d9fe189fdb3f25dc95e9fab.jpg';
const navgrah ='https://temple.yatradham.org/public/Product/puja-rituals/puja-rituals_GEFYROXd_202404211150110.jpg';
const mahamritu='https://trimbakguruji.com/wp-content/uploads/2023/04/photo_2023-04-15_15-41-51.webp';
const pitradosh = 'https://temple.yatradham.org/public/Product/puja-rituals/puja-rituals_Cye4lfxt_202312030925540.webp';
const poojaService1 = 'https://images.unsplash.com/photo-1598379435436-1e0c2b2a2b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const poojaService2 = 'https://images.unsplash.com/photo-1557020815-51e9e09d0a6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const poojaService3 = 'https://images.unsplash.com/photo-1582035905152-4a0b2b2a2b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

// Function to get translated pooja services
const getPoojaServices = (language) => [
	{
		title: t('pooja.services.officeInauguration.title', language),
		image: office,
		shortDesc: t('pooja.services.officeInauguration.shortDesc', language),
		content: `नए ऑफिस की प्रवेश पूजा (Office Inauguration Puja) बहुत ही शुभ और मंगलकारी मानी जाती है। यह पूजा नए कार्यस्थल को सकारात्मक ऊर्जा से भरने, व्यापार/ऑफिस में सफलता, समृद्धि और बाधा-रहित कार्य हेतु की जाती है।
-
-शुभ मुहूर्त
-गुरुवार, बुधवार या सोमवार श्रेष्ठ। अमावस्या, रविवार और राहुकाल वर्जित। मुख्य द्वार और कक्ष में वास्तु अनुसार मुहूर्त देखें।
-
-आवश्यक सामग्री
-गणपति जी की मूर्ति/फोटो, कलश-नारियल-आम्रपत्र, गंगाजल, पंचामृत, रोली-हल्दी-अक्षत, फूल-धूप-दीपक, दूर्वा, पान-सुपारी, मिठाई, हवन सामग्री, लाल/पीला वस्त्र, रजिस्टर/खाता-बही/नई डायरी।
-
-पूजा विधि (संक्षेप)
-1) शुद्धिकरण, 2) द्वार पूजन (स्वस्तिक/शुभ-लाभ/तोरण), 3) ईशान कोण में कलश स्थापना, 4) गणेश पूजन (ॐ गं गणपतये नमः), 5) लक्ष्मी पूजन (ॐ श्रीं महालक्ष्म्यै नमः), 6) दस्तावेज़/उपकरण पूजन, 7) हवन, 8) आरती, 9) प्रसाद वितरण।
-
-विशेष बातें
-गणेश-लक्ष्मी चित्र लगाएँ, तिजोरी उत्तर/ईशान में रखें, दीपक/नारियल से शुभारंभ करें, उसी दिन कोई लेन-देन अवश्य करें।`
	},
	{
		title: t('pooja.services.shivRudrabhishek.title', language),
		image: shivrudra,
		shortDesc: t('pooja.services.shivRudrabhishek.shortDesc', language),
		content: `रुद्राभिषेक में शिवलिंग पर जल, दूध, दही, घी, शहद, गंगाजल आदि से अभिषेक किया जाता है।
-
-सामग्री
-शिवलिंग, गंगाजल, पंचामृत, बेलपत्र, धतूरा, आक, चंदन, रोली, अक्षत, भस्म, पुष्प, धूप-दीप, कपूर, फल-नैवेद्य।
-
-विधि
-स्नान-शुद्धि → पंचामृत अभिषेक → गंगाजल स्नान → विभिन्न द्रव्यों से अभिषेक → मंत्र जप (ॐ नमः शिवाय/ॐ नमः भगवते रुद्राय) → बिल्वपत्र अर्पण → आरती → नैवेद्य।
-
-प्रकार व फल
-दूध: आयु/समृद्धि, घी: रोग शांति, दही: संतान सुख, शहद: सौभाग्य, गन्ना रस: धन, जल: पाप शमन, काले तिल जल: पितृ दोष शांति, नारियल जल: लक्ष्मी प्राप्ति, चंदन जल: मानसिक शांति, अखण्ड रुद्राभिषेक।
-
-विशेष
- सोमवार, प्रदोष, महाशिवरात्रि, श्रावण में विशेष। घर या मंदिर में संभव।`
	},
	{
		title: t('pooja.services.mahalaxmiPujan.title', language),
		image: mahalaxmi,
		shortDesc: t('pooja.services.mahalaxmiPujan.shortDesc', language),
		content: `महालक्ष्मी पूजन धन, ऐश्वर्य और सौभाग्य के लिए। दीपावली, कोजागरी पूर्णिमा, शुक्रवार, नए व्यापार/गृह प्रवेश पर विशेष।
-
-सामग्री
-महालक्ष्मी प्रतिमा, कलश-नारियल-आम्रपत्र, गंगाजल, पंचामृत, चावल, रोली, हल्दी, कमल/लाल-पीले पुष्प, लाल कपड़ा, सिक्के/तिजोरी, दीपक-धूप, कपूर, मिठाई।
-
-विधि
-शुद्धि → आसन/कलश स्थापना → गणेश पूजन → लक्ष्मी पूजन (स्नान, वस्त्र, चंदन, अक्षत, कमल, सिक्के; मंत्र: ॐ श्रीं महालक्ष्म्यै नमः) → तिजोरी/साधन पूजन → आरती → प्रसाद।
-
-महत्व
-दरिद्रता नाश, धन-वैभव वृद्धि, व्यापार/नौकरी में उन्नति, शांति और सौभाग्य।`
	},
	{
		title: t('pooja.services.yajnopavit.title', language),
		image: janeyu,
		shortDesc: t('pooja.services.yajnopavit.shortDesc', language),
		content: `उपनयन/यज्ञोपवीत संस्कार वैदिक अधिकार और आचार-पथ की शुरुआत।
-
-महत्व
-द्विजत्व, गायत्री दीक्षा, ज्ञान-अनुशासन का प्रतीक; ब्राह्मण/क्षत्रिय/वैश्य के लिए शास्त्रीय।
-
-सामग्री
-यज्ञोपवीत, पीत वस्त्र, आसन, कुशा, गंगाजल, अक्षत-रोली-हल्दी, पुष्प-धूप-दीप, पान-सुपारी, फल-मिठाई, हवन सामग्री।
-
-विधि (संक्षेप)
-शुद्धि-संकल्प → मातृ-पितृ पूजन → गणेश पूजन → (परंपरा अनुसार) मुण्डन/कर्णवेध → जनेऊ धारण (तीन ऋणों का स्मरण) → गायत्री उपदेश → हवन → आशीर्वाद।
-
-विशेष
-सामान्यतः 7–12 वर्ष; परंतु मुहूर्तानुसार किसी भी आयु में संभव।`
	},
	{
		title: t('pooja.services.namkaran.title', language),
		image: naamkaran,
		shortDesc: t('pooja.services.namkaran.shortDesc', language),
		content: `नामकरण संस्कार शिशु की सामाजिक-धार्मिक पहचान का प्रारंभ।
-
-समय
-11/12/13वां दिन, या 101वां दिन/1 वर्ष के भीतर; शुभ मुहूर्त में।
-
-सामग्री
-शिशु वस्त्र/आसन, कलश-नारियल-आम्रपत्र, गंगाजल, पंचामृत, हल्दी-रोली-अक्षत, पुष्प, हवन सामग्री, नाम के अक्षर हेतु ज्योतिष मार्गदर्शन।
-
-विधि
-शुद्धि → कलश स्थापना → गणेश पूजन → ग्रह-नक्षत्र/कुलदेवता पूजन → शिशु पूजन → नाम घोषणा (दाहिने कान में 3 बार) → हवन → आशीर्वाद → प्रसाद/भोज।
-
-विशेष
-नाम शुभ, सरल और अर्थपूर्ण; नक्षत्र/राशि/परंपरा अनुसार।`
	},
	{
		title: t('pooja.services.chandiHavan.title', language),
		image: chandi,
		shortDesc: t('pooja.services.chandiHavan.shortDesc', language),
		content: `चंडी हवन अत्यंत शक्तिशाली और प्रभावशाली पूजा मानी जाती है। यह देवी माँ दुर्गा के उग्र रूप माँ चंडी (महाकाली, महालक्ष्मी और महासरस्वती का संयुक्त रूप) की उपासना है। इसे विशेष रूप से नवरात्रि, अष्टमी, नवमी, दुर्गा सप्तशती पाठ या बड़ी बाधाओं को दूर करने हेतु किया जाता है।

महत्व
- शत्रु नाश, पाप शमन और जीवन में आ रही कठिनाइयों को दूर करने के लिए।
- परिवार और समाज की रक्षा हेतु।
- धन, शक्ति, यश और विजय प्राप्ति के लिए।
- ग्रहदोष, कष्ट, भूत-प्रेत बाधा और अज्ञात भय को मिटाने के लिए।

आवश्यक सामग्री
- माँ चंडी/दुर्गा की प्रतिमा या चित्र
- कलश, नारियल, आम्रपत्र
- गंगाजल, पंचामृत
- अक्षत, रोली, हल्दी, सिंदूर
- पुष्पमाला, गुलाल, चुनरी
- 9 कन्याएँ (यदि संभव हो तो कुमारी पूजन हेतु)
- हवन कुंड, लकड़ी, समिधा
- हवन सामग्री, घी, कपूर
- दुर्गा सप्तशती/देवी महात्म्य पाठ की पुस्तक
- नैवेद्य, फल, मिठाई

विधि (संक्षेप में)
1. शुद्धिकरण और संकल्प – स्थान को गंगाजल से शुद्ध करें और संकल्प लें।
2. कलश स्थापना – ईशान कोण में कलश रखकर देवी का आवाहन करें।
3. गणेश पूजन – सबसे पहले गणेश जी की पूजा करें।
4. देवी पूजन – माँ चंडी/दुर्गा की प्रतिमा को स्नान कराकर, वस्त्र, सिंदूर, फूल, चुनरी और आभूषण अर्पित करें।
5. दुर्गा सप्तशती पाठ – सप्तशती के 13 अध्याय या केवल "देवी कवच, अर्गला स्तोत्र और कीलक स्तोत्र" सहित संपूर्ण पाठ करें।
6. चंडी हवन – हवन कुंड में अग्नि प्रज्वलित करें। "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे" मंत्र से आहुति दें। सप्तशती के प्रत्येक श्लोक पर "स्वाहा" उच्चारण कर आहुति दी जाती है।
7. कन्या पूजन – संभव हो तो 9 कन्याओं को भोजन व वस्त्र देकर पूजन करें।
8. आरती और प्रसाद – देवी की आरती करें और प्रसाद बांटें।

चंडी हवन के प्रमुख मंत्र
- बीज मंत्र: ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे ॥
- देवी गायत्री मंत्र: ॐ चण्डिकायै च विद्महे, महादेवायै धीमहि, तन्नो देवी प्रचोदयात् ॥

विशेष बातें
- चंडी हवन प्रायः विद्वान ब्राह्मणों और पंडितों की सहायता से किया जाता है।
- नवरात्रि, अष्टमी, नवमी, शुक्रवार और पूर्णिमा के दिन इसका विशेष महत्व है।
- हवन के समय शुद्ध आचरण और सात्त्विकता का पालन करना आवश्यक है।`
	},
	{
		title: t('pooja.services.navgrahPujan.title', language),
		image: navgrah,
		shortDesc: t('pooja.services.navgrahPujan.shortDesc', language),
		content: `नवग्रह पूजन सूर्य-चन्द्र-मंगल-बुध-गुरु-शुक्र-शनि-राहु-केतु की शांति हेतु।
-
-महत्व
-ग्रहदोष शमन, आयु-स्वास्थ्य-धन-विद्या-संतान-समृद्धि, बाधा निवारण।
-
-सामग्री
-कलश, गंगाजल, वस्त्र/पुष्प, हवन कुंड/समिधा/घी, नवग्रह यंत्र/चित्र, नैवेद्य।
-
-विधि
-शुद्धि-संकल्प → गणेश/कलश स्थापना → क्रमशः 9 ग्रहों का पूजन → नवग्रह मंत्र जाप → हवन (कम से कम 11/108 आहुति) → आरती/प्रसाद।
-
-बीज मंत्र (संक्षेप)
-सूर्य: ॐ ह्रां ह्रीं ह्रौं..., चन्द्र: ॐ श्रां श्रीं श्रौं..., मंगल: ॐ क्रां क्रीं क्रौं..., बुध: ॐ ब्रां ब्रीं ब्रौं..., गुरु: ॐ ग्रां ग्रीं ग्रौं..., शुक्र: ॐ द्रां द्रीं द्रौं..., शनि: ॐ प्रां प्रीं प्रौं..., राहु: ॐ भ्रां भ्रीं भ्रौं..., केतु: ॐ स्रां स्रीं स्रौं...
-
-विशेष
- सोम/शनिवार/अमावस्या में फलदायी; नए आरंभ में शुभ।`
	},
	{
		title: t('pooja.services.mahamrityunjay.title', language),
		image: mahamritu,
		shortDesc: t('pooja.services.mahamrityunjay.shortDesc', language),
		content: `महामृत्युंजय हवन भगवान शिव के महामृत्युंजय रूप को समर्पित है। यह अनुष्ठान आयु वृद्धि, रोग शांति, अकाल मृत्यु से रक्षा, मानसिक-शारीरिक स्वास्थ्य और जीवन की समृद्धि हेतु अत्यंत प्रभावी माना गया है।

महत्व
- अकाल मृत्यु और असाध्य रोगों से रक्षा करता है।
- दीर्घायु और आरोग्य प्रदान करता है।
- घर-परिवार से नकारात्मक ऊर्जा दूर करता है।
- शांति, सुख और आध्यात्मिक उन्नति देता है।

आवश्यक सामग्री
- भगवान शिव की प्रतिमा/लिंगम
- बेलपत्र, धतूरा, आक, दूर्वा, गंगाजल
- दूध, दही, शहद, घी, शक्कर (पंचामृत)
- चंदन, अक्षत, रोली, पुष्प, फल
- हवन कुंड, आम की लकड़ी, समिधा
- हवन सामग्री, घी, कपूर
- रुद्राक्ष माला (जप के लिए)

पूजन विधि (संक्षेप में)
1. स्थान शुद्धि और संकल्प – गंगाजल से शुद्धिकरण कर संकल्प लें।
2. गणेश पूजन – विघ्नहर्ता गणेश जी की पूजा करें।
3. कलश स्थापना – ईशान कोण में कलश स्थापित कर देवताओं का आवाहन करें।
4. शिव पूजन – शिवलिंग पर जल, दूध, पंचामृत, बेलपत्र, धतूरा, पुष्प अर्पित करें।
5. महामृत्युंजय मंत्र जप – रुद्राक्ष माला से कम से कम 108 बार (या 11 माला) जप करें।
   मंत्र: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥"
6. हवन प्रारंभ – अग्नि प्रज्वलित कर हवन सामग्री अर्पित करें। प्रत्येक आहुति पर मंत्र उच्चारण करें: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् स्वाहा" (कम से कम 108 आहुति)।
7. पूजन पूर्णता – आरती करें, प्रसाद बांटें और शिवजी का आशीर्वाद लें।

हवन के लाभ
- रोग निवारण और शीघ्र स्वास्थ्य लाभ।
- ग्रहदोष और नकारात्मक ऊर्जा से मुक्ति।
- कठिन परिस्थितियों से पार पाने की शक्ति।
- परिवार की सुरक्षा और समृद्धि।

विशेष
- विशेषकर सोमवार, प्रदोष, महाशिवरात्रि या किसी भी शुभ मुहूर्त में यह हवन सर्वोत्तम फल देता है।`
	},
	{
		title: t('pooja.services.durgaHavan.title', language),
		image: durga,
		shortDesc: t('pooja.services.durgaHavan.shortDesc', language),
		content: `दुर्गा हवन नवरात्रि/अष्टमी/नवमी/शुक्रवार/পূর্ণिमा में श्रेष्ठ।
-
-सामग्री
-दुर्गा प्रतिमा, कलश, लाल वस्त्र/चुनरी/सिंदूर, हवन कुंड/समिधा/घी, सप्तशती पुस्तक।
-
-विधि
-शुद्धि/संकल्प → गणेश/कलश स्थापना → देवी पूजन → सप्तशती पाठ → हवन (ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे स्वाहा) → कन्या पूजन → आरती/प्रसाद।
-
-मंत्र
-बीज: ॐ ऐं ह्रीं क्लीं..., दुर्गा गायत्री: ॐ कात्यायनायै विद्महे...
-
-विशेष
-घर में शांति, सौभाग्य और शक्ति की वृद्धि।`
	},
	{
		title: t('pooja.services.laxmiKuber.title', language),
		image: laxmikub,
		shortDesc: t('pooja.services.laxmiKuber.shortDesc', language),
		content: `धनतेरस/अक्षय तृतीया/दीपावली/पूर्णिमा/शुक्रवार में विशेष।

महत्व
धन/ऐश्वर्य, करियर सफलता, ऋण मुक्ति, स्थिर समृद्धि।

सामग्री
लक्ष्मी-कुबेर चित्र, कलश, लाल/पीले वस्त्र, हवन कुंड/समिधा/घी/मसाले, सूखे मेवे, यंत्र।

विधि
शुद्धि-संकल्प → गणेश/कलश → लक्ष्मी पूजन (लाल) → कुबेर पूजन (पीला) → मंत्र जप/श्रीसूक्त → हवन (कम से कम 108 आहुति) → आरती/प्रसाद।

मंत्र
महालक्ष्मी: ॐ श्रीं महालक्ष्म्यै नमः ॥, कुबेर: ॐ यक्षाय कुबेराय... ॥, संयुक्त हवन: ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै कुबेराय नमः स्वाहा ॥`
	},
	{
		title: t('pooja.services.pitruDosh.title', language),
		image: pitradosh,
		shortDesc: t('pooja.services.pitruDosh.shortDesc', language),
		content: `पितृ दोष कुंडली में दिखाई देने वाला दोष है जो प्रायः पितरों की अशांति/श्राद्ध-तर्पण के अभाव से उत्पन्न माना जाता है। इस दोष से जीवन में उतार-चढ़ाव, अवरोध और विविध कठिनाइयाँ बनी रह सकती हैं।
+
+पितृ कौन हैं
+- हमारे पूर्वज/मृत परिजन, जिनके लिए विधिवत श्राद्ध/तर्पण आवश्यक है।
+- भाद्रपद शुक्ल पूर्णिमा से आश्विन कृष्ण अमावस्या तक 'पितृ पक्ष' माना जाता है — इस काल में तर्पण/श्राद्ध का विशेष महत्त्व।
+
+कारण (संकेत)
+- अकाल/अविवाहित मृत्यु अथवा श्राद्ध न होना; आत्मा की अशांति।
+- 9वें भाव (भाग्यस्थान) में पितृ दोष के योग, जिससे भाग्योदय में देरी और बाधाएँ।
+- स्वप्न-संकेत: पूर्वजों का भोजन/वस्त्र माँगना, नाग-दर्शन इत्यादि।
+
+संभावित परिणाम
+- जन्म से मानसिक/शारीरिक विकास में बाधा, बाल्यावस्था में रोग-व्याधि।
+- किशोरावस्था में अध्ययन-अनुरक्ति की कमी/बार-बार बदलाव, कुसंग/व्यसन।
+- युवावस्था/प्रौढ़ावस्था में नौकरी/व्यापार/विवाह में अस्थिरता; प्रमोशन/स्थिरता में कठिनाई।
+- दांपत्य तनाव, गर्भधारण में समस्या/गर्भपात की संभावना।
+- जीवन में सफलता में अवरोध, धनाभाव/ऋण-भार, गृह-अशांति।
+
+निवारण/विधान
+- पितृ तर्पण, श्राद्ध, पिण्डदान; ज्ञात-अज्ञात पितरों की शांति हेतु।
+- नवग्रह/नक्षत्र शांति, हवन और दान — विशेषतः पितृ पक्ष में।
+- योग्य पंडित द्वारा शास्त्रोक्त विधि से संकल्प, तिथि-निश्चित कर्म और सात्त्विक आचरण।`
	},
	{
		title: t('pooja.services.mangalDosh.title', language),
		image: mangal,
		shortDesc: t('pooja.services.mangalDosh.shortDesc', language),
	content: `मंगल दोष (मांगलिक दोष) तब बनता है जब जन्मकुंडली के 1, 4, 7 या 12वें भाव में मंगल स्थित हो। इससे भूमि/संपत्ति कार्यों में बाधा, ऋण-प्रश्न, वैवाहिक देरी और विवाहोपरांत कलह जैसी समस्याएँ बढ़ सकती हैं। वैदिक विधि से यह पूजा दोष के प्रभाव को शांत करने का उपाय है।
+
+मंगल दोष के प्रभाव
+- विवाह में देरी, वैवाहिक जीवन में तकरार और अस्थिरता
+- भूमि/निर्माण/संपत्ति संबंधी बाधाएँ
+- ऋणमुक्ति में कठिनाई और कार्य-सिद्धि में अवरोध
+
+निवारण हेतु वैदिक पूजा (विधान)
+- श्रेष्ठ मुहूर्त, तिथि और नक्षत्र में विद्वान पंडित द्वारा संपन्न।
+- स्त्री की पत्रिका में माँ कात्यायनी की उपासना; पुरुष की पत्रिका हेतु भगवान विष्णु की पारंपरिक उपासना।
+- एकादश सहस्त्र (11000) संख्या मंत्र-जाप षोडशोपचार पूजन के साथ।
+- होम (हवन) में घी, तिल, जौ आदि की आहुति; सूर्यादि संख्याओं के मंत्र-पाठ के साथ अग्नि में अर्पण।
+- संपूर्ण अनुष्ठान सामान्यतः 5–6 घंटे में संपन्न किया जाता है।
+
+लाभ
+- दांपत्य जीवन में समृद्धि और सौहार्द, संबंधों में सुधार
+- स्वास्थ्य-संबंधी बाधाओं का शमन, मानसिक/शारीरिक चिंताओं में कमी
+- रुके हुए कार्यों की सिद्धि, करियर/नौकरी में प्रगति
+- संपत्ति/भूमि कार्यों में सफलता और ऋण-समस्याओं में राहत`
	},
	{
		title: t('pooja.services.kumbhVivah.title', language),
		image: kumbh,
		shortDesc: t('pooja.services.kumbhVivah.shortDesc', language),
		content: `घट/कुंभ विवाह से वैवाहिक दोष शमन का शास्त्रीय उपाय।
-
-संदर्भ
-मंगल/वैधव्य/विषकन्या योग इत्यादि में शमनार्थ।
-
-प्रक्रिया
-गणेश/पुण्याह/ग्रहशांति → विष्णु-रूप कलश का षोडशोपचार पूजन → अग्नि सहित सात परिक्रमा/मंगलाष्टक → अभिषेक व आशीर्वाद।
-
-परिणाम
-दोष शमन, स्थायी/सुखी दाम्पत्य हेतु मंगलप्रद.`
	},
	{
		title: t('pooja.services.santanGopal.title', language),
		image: gopal,
		shortDesc: t('pooja.services.santanGopal.shortDesc', language),
		content: `बाल गोपाल की कृपा हेतु जप-हवन।
-
-महत्व
-गर्भाधान/गर्भस्थ शुचिता, जोखिम में कमी, संतान की बुद्धि/जीवन समृद्धि।
-
-विधि
-कृष्ण पूजन, मंत्र जप, हवन; माँ-शिशु की रक्षा/सुदृढ़ता हेतु प्रार्थना.`
	},
	{
		title: t('pooja.services.narayanBali.title', language),
		image: narayanbali,
		shortDesc: t('pooja.services.narayanBali.shortDesc', language),
		content: `ज्ञात मृतक आत्मा की शांति/मुक्ति हेतु नारायण बलि।
-
-विधान
-नारायण/पार्षद आवाहन, पूजन, तर्पण, पिण्डदान; त्रिपिंडी श्राद्ध (अज्ञात के लिए)।
-
-फल
-घर-परिवार की शांति, अवरोध/รोग/कलह का शमन, सद्गति की प्रार्थना।`
	},
	{
		title: t('pooja.services.bhagwatKatha.title', language),
		image: bhagwat,
		shortDesc: t('pooja.services.bhagwatKatha.shortDesc', language),
		content: `भागवत सप्ताह श्रवण/पाठ से आत्मिक कल्याण, दोष निवारण और धर्म-प्रवर्धन। शास्त्रोक्त विधि, हवन/तर्पण सहित।`
	},
	{
		title: t('pooja.services.vivahSanskar.title', language),
		image: vivah,
		shortDesc: t('pooja.services.vivahSanskar.shortDesc', language),
		content: `वैदिक विवाह गृहस्थाश्रम में प्रवेश का महत्त्वपूर्ण संस्कार।
-
-मुख्य चरण
-वर-वधू चयन, मांगलिक आरंभ, जैमाला, कन्यादान, अग्नि साक्षी, सप्तपदी (7 व्रत), सिंदूर/मंगलसूत्र, आशीर्वाद।
-
-आध्यात्मिक दृष्टि
-अग्नि साक्षी प्रतिज्ञा, अर्धांग/अर्धांगिनी भाव, धर्म/जीवन की पूर्णता.`
	},
	{
		title: t('pooja.services.grahPravesh.title', language),
		image: grah,
		shortDesc: t('pooja.services.grahPravesh.shortDesc', language),
		content: `गृह प्रवेश पूजा (घर में पहली बार प्रवेश) का उद्देश्य नया घर पवित्र करना, नकारात्मकता दूर करना और परिवार के लिए सुख-समृद्धि, स्वास्थ्य और शांति का आशीर्वाद प्राप्त करना है।
+
+गृह प्रवेश पूजा के प्रकार
+1. अपरा गृह प्रवेश – जब घर बनकर पूरा हो जाए।
+2. सपिंड गृह प्रवेश – जब बहुत समय तक घर खाली रहा हो और पुनः प्रवेश करना हो।
+3. द्वार गृह प्रवेश – नए खरीदे/किराये के घर में प्रवेश।
+
+शुभ मुहूर्त
+- शुभ लग्न, तिथि और नक्षत्र देखकर करें।
+- सामान्यतः वसंत, ग्रीष्म और शरद ऋतु उत्तम।
+- अमावस्या, संक्रांति और राहुकाल में वर्जित।
+
+आवश्यक सामग्री
+- कलश, नारियल, आम की पत्तियां
+- पंचामृत (दूध, दही, घी, शहद, शक्कर)
+- गंगाजल
+- अक्षत (चावल), रोली, हल्दी
+- फूल, हार, धूप, दीपक
+- सात अन्न के दाने (सप्तधान्य)
+- गोबर/गोमूत्र (शुद्धिकरण हेतु)
+- हवन सामग्री
+
+विधि (संक्षेप में)
+1. शुद्धिकरण – पानी, गंगाजल, गोमूत्र और गोबर से घर का शुद्धिकरण।
+2. द्वार पूजन – मुख्य द्वार पर तोरण, आम्रपल्लव और स्वस्तिक बनाएं।
+3. कलश स्थापना – ईशान कोण (उत्तर-पूर्व) में कलश स्थापित करें।
+4. गणेश पूजन – विघ्नहर्ता गणेश जी की पूजा करें।
+5. नवग्रह पूजन – नवग्रहों की शांति और आशीर्वाद हेतु मंत्रोच्चार।
+6. वास्तु पूजन – भूमि, दिशाओं और वास्तु देवता का पूजन।
+7. हवन – गृहोत्सर्ग यज्ञ कर अग्नि में आहुति दें।
+8. गृह प्रवेश – पूजा के बाद मुखिया दंपति पहले प्रवेश करें, फिर अन्य सदस्य।
+9. अन्नपूर्णा पूजन – रसोई में अन्नपूर्णा देवी का पूजन कर सबसे पहले खीर/मिठाई बनाएं।
+
+विशेष बातें
+- गृह प्रवेश हमेशा परिवार के मुखिया दंपति को करना चाहिए।
+- गाय, ब्राह्मण और कन्याओं को भोजन करवाना शुभ है।
+- उसी दिन घर में रात्रि विश्राम करें; बाहर रात न बिताएं।`
	},
	{
		title: t('pooja.services.satyaNarayan.title', language),
		image: satya,
		shortDesc: t('pooja.services.satyaNarayan.shortDesc', language),
		content: `सत्यनारायण पूजा गृह-शांति/समृद्धि हेतु।
-
-विधि
-शुद्धि → कलश स्थापना → गणेश पूजन → विष्णु/सत्यनारायण अर्चना → पंचामृत स्नान → सहस्रनाम/108 नाम → कथा श्रवण (5 अध्याय) → आरती → हवन (यदि संभव) → प्रसाद।
-
-विशेष
-तुलसीदल अवश्य अर्पित करें, व्रती सात्त्विक रहे.`
	},
	{
		title: t('pooja.services.ganpatiPuja.title', language),
		image: ganpati,
		shortDesc: t('pooja.services.ganpatiPuja.shortDesc', language),
		content: `गणेश जी प्रथम पूज्य; हर शुभ कार्य का आरंभ।
-
-विधि
-शुद्धि → आवाहन (ॐ गं गणपतये नमः) → आसन/अर्घ्य → स्नान/वस्त्र → चंदन/अक्षत → फूल/दूर्वा (21) → भोग (मोदक) → आरती → प्रदक्षिणा/प्रसाद।
-
-मंत्र
-बीज: ॐ गं गणपतये नमः, गणेश गायत्री: ॐ एकदन्ताय विद्महे...
-
-विशेष
-मंगलवार/चतुर्थी विशेष।`
	},
	{
		title: t('pooja.services.kaalSarp.title', language),
		image: sarp,
		shortDesc: t('pooja.services.kaalSarp.shortDesc', language),
		content: `जब सभी सात ग्रह राहु और केतु के बीच आ जाएँ, तब कालसर्प दोष बनता है। यह स्थिति पूर्वजन्म कर्मों के कारण प्रायः जन्मजात कष्टों/अवरोधों का कारक मानी जाती है और व्यक्ति के जीवन-पथ को लंबे समय तक प्रभावित कर सकती है।
+
+समय-अवधि और प्रभाव
+- सामान्यतः प्रभाव 47 वर्ष तक रह सकता है; कुछ कुंडलियों में आजीवन भी।
+- अन्य शुभ योगों के फलों में बाधा, जीवन में संघर्ष, तनाव और अनियमितता।
+- संतान-सुख में बाधा, आर्थिक दबाव, वैवाहिक अस्थिरता, स्वास्थ्य और मानसिक व्याधियाँ।
+
+कालसर्प दोष के प्रकार
+- 12 प्रमुख प्रकार राहु-केतु की स्थितियों पर आधारित: अनंत, कुलिक, वासुकि, शंखपाल, पद्म, महापद्म, तक्षक, कर्कोटक, शंखनाद, घटक, विशधर/विशारद, शेषनाग।
+
+संभावित लक्षण
+- मृत जनों के स्वप्न, पीछा/ठगे जाने का भाव, एकाकीपन।
+- सर्प-दंश का भय, सपनों में सर्पों से घिरने का अनुभव।
+- एयरोफोबिया/ऊँचे खुले स्थानों का भय, मानसिक विचलन।
+- परिवार/समाज हेतु समर्पण-भाव, आत्मकेन्द्रितता में कमी।
+
+निवारण/विधान
+- राहु-केतु शांति, नवग्रह जप-हवन, नाग पूजन/दान।
+- श्रेष्ठ मुहूर्त में विद्वान पंडित द्वारा वैदिक अनुष्ठान।
+- दोष-प्रकार व ग्रहस्थितिनुसार विशेष मंत्र-जाप व हवन-विधि अपनाई जाती है।`
	},
	{
		title: t('pooja.services.guruChandal.title', language),
		image: guru,
		shortDesc: t('pooja.services.guruChandal.shortDesc', language),
	content: `जब जन्मकुंडली में गुरु (बृहस्पति) और राहु का किसी भी प्रकार का संबंध बने, तब गुरु चांडाल दोष बनता है। राहु के प्रभाव में गुरु भी अशुभ फल देने लगते हैं, अतः इसे साढ़ेसाती, कालसर्प और मंगल दोष से भी अधिक अशुभ माना गया है। यह दोष अनैतिक प्रवृत्तियों, षड्यंत्र, विपरीतलिंगी आकर्षण, चारित्रिक पतन, चोरी/जुआ/सट्टा/अनैतिक धनार्जन, मद्यपान एवं हिंसक व्यवहार की प्रवृत्तियों को बढ़ा सकता है।
+
+विस्तृत पूजा विधि
+- वैदिक मंत्रोच्चार और जप से प्रारंभ।
+- होम (हवन): घी, तिल, जौ और अन्य पवित्र सामग्री, निर्धारित मंत्र-पाठ के साथ अग्नि में अर्पित।
+- सर्वोत्तम परिणाम हेतु श्रेष्ठ मुहूर्त, तिथि और नक्षत्र में अनुष्ठान।
+- योग्य/विद्वान पंडित द्वारा एक दिन में सांविधि सम्पन्न।
+
+लाभ
+- जीवन में समृद्धि और मनोवांछित फल की प्राप्ति।
+- व्यवहार में सकारात्मकता, संयम और सदाचार का विकास।
+- स्वास्थ्य-सुधार, मानसिक/शारीरिक चिंताओं में कमी।
+- महत्वपूर्ण कार्यों की सिद्धि; रुके हुए कार्य पूर्ण होना।
+- नौकरी/करियर/जीवन-पथ की बाधाओं का निवारण।`
	},
	{
		title: t('pooja.services.sundarkand.title', language),
		image: sundar,
		shortDesc: t('pooja.services.sundarkand.shortDesc', language),
		content: `सुन्दरकाण्ड भगवान हनुमानजी को समर्पित है। रामायण का यह अध्याय पाठ और हवन जीवन में आने वाली बाधाओं, रोग, ऋण, शत्रु और भय को दूर करता है। यह विशेष रूप से मंगलवार, शनिवार या संकट के समय करने पर अत्यधिक फलदायी माना गया है।

महत्व
- रोग, भय, दरिद्रता और शत्रु बाधाओं से मुक्ति।
- घर-परिवार की रक्षा और शांति।
- आत्मविश्वास, बल, बुद्धि और विजय की प्राप्ति।
- हनुमानजी की कृपा से सभी कार्य सिद्धि।

आवश्यक सामग्री
- हनुमानजी व श्रीराम-सीता-लक्ष्मण की प्रतिमा/चित्र
- रामायण/सुन्दरकाण्ड की पुस्तक
- कलश, गंगाजल, चंदन, अक्षत, पुष्प
- सिंदूर, जनेऊ, लाल वस्त्र, तुलसी पत्र
- फल, नैवेद्य, गुड़, बेसन के लड्डू, पान-सुपारी
- हवन कुंड, आम की लकड़ी, समिधा
- हवन सामग्री, घी, कपूर
- रुद्राक्ष/तुलसी माला

पूजन विधि (संक्षेप में)
1. स्थान शुद्धि और संकल्प – गंगाजल से स्थान शुद्ध करें और संकल्प लें।
2. गणेश पूजन – सबसे पहले गणपति जी की पूजा करें।
3. राम-सीता-हनुमान पूजन – प्रतिमा को स्नान कराकर वस्त्र, पुष्प, सिंदूर, नैवेद्य अर्पित करें।
4. सुन्दरकाण्ड पाठ – पूरे अध्याय का पाठ करें (यदि समय न हो तो मुख्य चौपाइयाँ भी पढ़ सकते हैं)।
5. हवन प्रारंभ – अग्नि प्रज्वलित करें। प्रत्येक चौपाई/मंत्र पर "स्वाहा" कहकर आहुति दें। विशेष मंत्र से आहुति: "ॐ हनुमते नमः स्वाहा" या "ॐ श्रीरामचन्द्राय नमः स्वाहा"。
6. आरती – हनुमानजी और श्रीराम की आरती करें।
7. भोग और प्रसाद – हनुमानजी को गुड़-चने, बेसन लड्डू या पान अर्पित कर प्रसाद वितरित करें।

मुख्य मंत्र
- हनुमान बीज मंत्र: ॐ ऐं भ्रीम हनुमते, श्रीराम दूताय नमः ॥
- सुन्दरकाण्ड हवन आहुति मंत्र: ॐ श्रीरामदूताय हनुमते नमः स्वाहा ॥
- राम मंत्र: ॐ श्रीरामाय नमः ॥

विशेष बातें
- मंगलवार और शनिवार को यह हवन सर्वोत्तम फल देता है।
- संकटमोचन हनुमान जी के मंदिर में या घर के पवित्र स्थान पर करना श्रेष्ठ है।
- सामूहिक रूप से किया गया सुन्दरकाण्ड हवन अत्यधिक शक्तिशाली और मंगलकारी होता है।`
	},
	{
		title: t('pooja.services.kaalBhairav.title', language),
		image: kaal,
		shortDesc: t('pooja.services.kaalBhairav.shortDesc', language),
		content: `काल भैरव भगवान शिव का उग्रतम स्वरूप हैं। उनकी पूजा से भय, शत्रु, रोग, अकाल मृत्यु और अदृश्य शक्तियों से रक्षा होती है। काल भैरव विशेष रूप से काल (समय) के अधिपति माने जाते हैं।\n\nमहत्व\n- आयु वृद्धि और अकाल मृत्यु से रक्षा।\n- शत्रु नाश और भय का निवारण।\n- तंत्र बाधा, भूत-प्रेत, ग्रहदोष से मुक्ति।\n- जीवन में साहस, आत्मविश्वास और शक्ति की प्राप्ति।\n\nआवश्यक सामग्री\n- काल भैरव का चित्र/प्रतिमा\n- गंगाजल, कलश, नारियल, आम्रपत्र\n- रुद्राक्ष की माला\n- पुष्पमाला, बेलपत्र, धूप, दीप, अगरबत्ती\n- काले तिल, उड़द, सरसों, काला वस्त्र\n- मदिरा या भोग (कुछ परंपराओं में)\n- हवन सामग्री, आम की लकड़ी, घी\n- फल, मिठाई, नैवेद्य\n\nपूजा विधि\n1) स्थान शुद्धि व संकल्प: स्थान को गंगाजल से शुद्ध करें। संकल्प लें — "मैं (अपना नाम) अपने परिवार की शांति, आरोग्य और समृद्धि के लिए भद्रकाली माता का पूजन एवं हवन कर रहा/रही हूँ।" और "मैं (अपना नाम) नवदुर्गा माता की स्थापना एवं पूजन कर परिवार की सुख-समृद्धि, स्वास्थ्य और रक्षा हेतु यह पूजा कर रहा/रही हूँ।"\n2) गणेश पूजन – विघ्नहर्ता गणेश जी का पूजन करें।\n3) नवग्रह पूजन – सभी नौ ग्रहों की विधिवत पूजा और आह्वान करें।\n4) कुलदेवता और पितृ पूजन – परिवार के कुलदेवता और पितरों का स्मरण करें।\n5) विशेष मूल नक्षत्र शांति पाठ – नक्षत्र शांति मंत्र का जाप किया जाता है। "ॐ मूल नक्षत्राधिपतये नमः" से मंत्रोच्चार कर आहुति दी जाती है।\n6) हवन – हवन कुंड में अग्नि प्रज्वलित कर प्रत्येक मंत्र पर आहुति दें। "ॐ मूल नक्षत्राधिपतये स्वाहा ॥" नवग्रह मंत्रों से भी आहुति दी जाती है।\n7) दक्षिणा और दान – ब्राह्मण को दक्षिणा, अन्न, वस्त्र और दान देना शुभ माना जाता है।\n8) आरती और प्रसाद: सभी नौ रूपों की आरती करें। नैवेद्य और प्रसाद वितरित करें।\n\nप्रमुख मंत्र\n- मूल नक्षत्र शांति मंत्र: ॐ मूल नक्षत्राधिपतये देवायै नमः स्वाहा ॥\n- नवग्रह मंत्र (संक्षेप में):\n  सूर्य: ॐ ह्रां ह्रीं ह्रौं सूर्याय नमः स्वाहा ॥\n  चन्द्र: ॐ श्रां श्रीं श्रौं चन्द्राय नमः स्वाहा ॥\n  मंगल: ॐ क्रां क्रीं क्रौं भौमाय नमः स्वाहा ॥\n  बुध: ॐ ब्रां ब्रीं ब्रौं बुधाय नमः स्वाहा ॥\n  गुरु: ॐ ग्रां ग्रीं ग्रौं गुरवे नमः स्वाहा ॥\n  शुक्र: ॐ द्रां द्रीं द्रौं शुक्राय नमः स्वाहा ॥\n  शनि: ॐ प्रां प्रीं प्रौं शनैश्चराय नमः स्वाहा ॥\n  राहु: ॐ भ्रां भ्रीं भ्रौं राहवे नमः स्वाहा ॥\n  केतु: ॐ स्रां स्रीं स्रौं केतवे नमः स्वाहा ॥\n\nविशेष बातें\n- यह पूजा शिशु के जन्म के 27वें दिन या नामकरण संस्कार के समय की जाती है।\n- यदि समय पर न हो सके तो किसी भी शुभ मुहूर्त (विशेषकर मूल नक्षत्र में) में यह की जा सकती है।\n- शांति के लिए दान, गौसेवा, अन्नदान और ब्राह्मण भोजन कराना बहुत शुभ माना जाता है।`
	},
	{
		title: t('pooja.services.navdurgaStapna.title', language),
		image: navdurga,
		shortDesc: t('pooja.services.navdurgaStapna.shortDesc', language),
		content: `नवदुर्गा स्थापना पूजा माँ शक्ति के नौ स्वरूपों (शैलपुत्री, ब्रह्मचारिणी, चंद्रघंटा, कुष्मांडा, स्कंदमाता, कात्यायनी, कालरात्रि, महागौरी और सिद्धिदात्री) को समर्पित होती है। इसे नवरात्रि प्रारंभ में या किसी विशेष शुभ मुहूर्त पर किया जाता है। इस पूजा से संपूर्ण परिवार पर सुख, समृद्धि और स्वास्थ्य की प्राप्ति होती है।\n\nमहत्व\n- जीवन में सुख, शांति और समृद्धि की प्राप्ति।\n- शत्रु बाधा और नकारात्मक शक्तियों से सुरक्षा।\n- मानसिक शक्ति, साहस और आत्मविश्वास में वृद्धि।\n- संकटों का नाश और जीवन में मंगल और उन्नति।\n\nआवश्यक सामग्री\n- नवदुर्गा की प्रतिमा/चित्र (या नौ कलश/संकल्प कलश)\n- कलश, गंगाजल, नारियल, आम्रपत्र\n- अक्षत, रोली, हल्दी, चंदन\n- पुष्प, दीपक, धूप, अगरबत्ती\n- लाल और पीले वस्त्र, चुनरी\n- फल, नैवेद्य, मिठाई, सुपारी\n- हवन कुंड, आम की लकड़ी, घी, हवन सामग्री\n- रुद्राक्ष माला या सप्तशती/देवी पाठ पुस्तक\n\nपूजन विधि (संक्षेप में)\n1. स्थान शुद्धि और संकल्प: गंगाजल से स्थान को शुद्ध करें। संकल्प लें: "मैं (अपना नाम) नवदुर्गा माता की स्थापना एवं पूजन कर परिवार की सुख-समृद्धि, स्वास्थ्य और रक्षा हेतु यह पूजा कर रहा/रही हूँ।" और "मैं (अपना नाम) इस स्थान पर गणपति स्थापना कर सभी कार्यों में सफलता और बाधा रहित जीवन हेतु पूजन कर रहा/रही हूँ।"\n2. गणेश पूजन: विघ्नहर्ता गणेश जी का पूजन करें।\n3. कलश/प्रतिमा स्थापना: नौ कलश में जल, आम्रपत्र और नारियल रखकर नवदुर्गा का आवाहन करें। प्रतिमा को लाल/पीले वस्त्र से सजाएँ।\n4. नवदुर्गा पूजन: प्रत्येक रूप (शैलपुत्री से सिद्धिदात्री तक) का पुष्प, अक्षत, चंदन और नैवेद्य अर्पित करें। प्रत्येक रूप पर मंत्र उच्चारण करें: "ॐ देवी (रूप नाम) नमः ॥" और "ॐ गं गणपतये नमः" (108 बार श्रेष्ठ)।\n5. हवन विधि: हवन कुंड में अग्नि प्रज्वलित करें। प्रत्येक रूप के लिए आहुति दें: घी, तिल, उड़द, समिधा। मुख्य हवन मंत्र: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे स्वाहा ॥" और "ॐ दुं दुर्गायै स्वाहा"।\n6. आरती और प्रसाद: सभी नौ रूपों की आरती करें। नैवेद्य और प्रसाद वितरित करें।\n\nविशेष बातें\n- नवरात्रि के पहले दिन यह स्थापना पूजा सर्वोत्तम होती है।\n- यदि मूर्ति उपलब्ध न हो तो नवदुर्गा कलश स्थापना भी समान फलदायी है।\n- पूजा के दौरान सात्त्विक वातावरण और शुद्ध मन आवश्यक है।\n- इस पूजा के बाद नवदुर्गा पाठ, दुर्गा सप्तशती पाठ या आरती नियमित रूप से करें।`
	}
];

const PoojaPage = () => {
    const { language } = useLanguage();
    const pageRef = useRef(null);
    const bannerRef = useRef(null);
    const introRef = useRef(null);
    const servicesRef = useRef(null);
    const benefitsRef = useRef(null);
    const [selectedService, setSelectedService] = useState(null);
    
    const poojaServices = getPoojaServices(language);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            
            // Page entrance animation
            window.gsap.fromTo(pageRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
            );
            
            // Parallax effect on banner
            window.gsap.to(bannerRef.current, {
                backgroundPosition: '50% 100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: bannerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
            
            // Animations for sections
            const sections = [
                { ref: introRef, selector: '.intro-title, .intro-desc' },
                { ref: servicesRef, selector: '.pooja-card' },
                { ref: benefitsRef, selector: '.benefit-card' }
            ];
            
            sections.forEach(section => {
                const elements = section.ref.current?.querySelectorAll(section.selector);
                if (elements) {
                    window.gsap.fromTo(elements,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            stagger: 0.2,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: section.ref.current,
                                start: "top 80%",
                                toggleActions: "play none none none"
                            }
                        }
                    );
                }
            });
            
            // Floating animation for service cards
            const serviceCards = window.gsap.utils.toArray('.pooja-card');
            serviceCards.forEach(card => {
                window.gsap.to(card, {
                    y: -10,
                    duration: 3,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: Math.random() * 0.5
                });
            });
        }
    }, []);

    return (
        <div ref={pageRef} className="bg-gradient-to-b from-white to-[#F5F5F5] text-[#424242] font-sans pt-16">
            {/* Top Banner */}
            <header ref={bannerRef} className="relative w-full h-96 flex items-center justify-center text-center text-white overflow-hidden bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${poojaBannerUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#2E7D32]/70 to-[#1B5E20]/90"></div>
                <div className="relative z-10 p-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight font-serif">{t('pooja.title', language)}</h1>
                    <h2 className="text-xl md:text-3xl font-semibold mt-2 drop-shadow font-devanagari">{t('pooja.subtitle', language)}</h2>
                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto font-sanskrit italic">
                        "यज्ञेन दानेन तपसा चैव स्वाध्यायेन च। योगेन चर्मणा चैव त्यागेन शान्तिराच्यते॥"
                    </p>
                    <a href="#pooja-services-list" className="mt-8 inline-block bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transform hover:scale-105 transition-all duration-300 shadow-xl font-devanagari">
                        {t('pooja.viewServices', language)}
                    </a>
                </div>
            </header>
            
            {/* Introduction to Pooja Services */}
            <section ref={introRef} className="py-16 md:py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="intro-title text-3xl font-bold text-[#1B5E20] font-serif mb-6">{t('pooja.commitment', language)}</h3>
                    <p className="intro-desc max-w-3xl mx-auto text-lg leading-relaxed text-[#424242] bg-white p-8 rounded-2xl shadow-lg font-devanagari">
                        {t('pooja.description', language)}
                    </p>
                </div>
            </section>
            
            {/* List of Pooja Services */}
            <section ref={servicesRef} id="pooja-services-list" className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-4">{t('pooja.servicesTitle', language)}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                        {poojaServices.map((service, index) => (
                            <div key={index} className="pooja-card group p-8 rounded-2xl shadow-xl bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-[#FFB300]" onClick={() => setSelectedService(service)}>
                                <div className="w-full h-72 sm:h-80 md:h-88 lg:h-96 mx-auto mb-6 overflow-hidden rounded-xl shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:saturate-150">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover object-top" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1B5E20] mb-3 font-serif">{service.title}</h3>
                                <p className="text-[#424242] italic mb-4 font-devanagari leading-relaxed">{service.shortDesc}</p>
                                <button className="mt-4 text-[#FFB300] font-semibold flex items-center justify-center w-full group-hover:text-[#FFC107] transition-colors font-devanagari" onClick={(e) => { e.stopPropagation(); setSelectedService(service); }}>
                                    {t('common.learnMore', language)} <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedService(null)}></div>
                    <div className="relative z-10 bg-white max-w-3xl w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h4 className="text-2xl md:text-3xl font-bold text-[#1B5E20] font-serif pr-6">{selectedService.title}</h4>
                            <button className="text-[#1B5E20] hover:text-[#FFB300] text-xl font-bold" onClick={() => setSelectedService(null)}>×</button>
                        </div>
                        <div className="w-full h-52 md:h-64 mb-4 overflow-hidden rounded-lg">
                            <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="max-h-[55vh] overflow-y-auto">
                            <pre className="whitespace-pre-wrap break-words text-[#424242] leading-7 font-devanagari">{selectedService.content}</pre>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="bg-gradient-to-r from-[#FFB300] to-[#FFC107] text-white px-6 py-2 rounded-full font-semibold hover:from-[#FFC107] hover:to-[#FFD54F] transition-all" onClick={() => setSelectedService(null)}>{t('common.close', language)}</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Benefits Section */}
            <section ref={benefitsRef} className="py-16 md:py-20 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-[#1B5E20] font-serif mb-4">{t('pooja.whyChoose', language)}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="benefit-card flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-[#FFB300]/20 flex items-center justify-center mb-4">
                                <Award className="w-8 h-8 text-[#FFB300]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#1B5E20] mb-2 font-devanagari">{t('pooja.authenticRituals', language)}</h4>
                            <p className="text-[#424242] font-devanagari">{t('pooja.authenticDesc', language)}</p>
                        </div>
                        <div className="benefit-card flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-[#FFB300]/20 flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-[#FFB300]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#1B5E20] mb-2 font-devanagari">{t('pooja.punctuality', language)}</h4>
                            <p className="text-[#424242] font-devanagari">{t('pooja.punctualityDesc', language)}</p>
                        </div>
                        <div className="benefit-card flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-[#FFB300]/20 flex items-center justify-center mb-4">
                                <Handshake className="w-8 h-8 text-[#FFB300]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#1B5E20] mb-2 font-devanagari">{t('pooja.personalized', language)}</h4>
                            <p className="text-[#424242] font-devanagari">{t('pooja.personalizedDesc', language)}</p>
                        </div>
                        <div className="benefit-card flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                            <div className="w-16 h-16 rounded-full bg-[#FFB300]/20 flex items-center justify-center mb-4">
                                <Globe className="w-8 h-8 text-[#FFB300]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#1B5E20] mb-2 font-devanagari">{t('pooja.ecoFriendly', language)}</h4>
                            <p className="text-[#424242] font-devanagari">{t('pooja.ecoFriendlyDesc', language)}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap');
                
                .font-devanagari {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                }
                
                .font-serif {
                    font-family: 'Noto Serif Devanagari', serif;
                }
                
                .font-sanskrit {
                    font-family: 'Noto Sans Devanagari', sans-serif;
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

export default PoojaPage;