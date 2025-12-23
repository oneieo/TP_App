// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../../components/base/Button';
// import Card from '../../../components/base/Card';

// type UserType = 'customer' | 'merchant';

// export default function SignupPage() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [userType, setUserType] = useState<UserType | null>(null);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     phone: '',
//     birthDate: '',
//     affiliation: '',
//     customAffiliation: '',
//     businessName: '',
//     businessNumber: '',
//     businessAddress: '',
//     storeName: '',
//     storePhone: '',
//     storeEmail: '',
//     storePassword: '',
//     phoneVerification: '',
//     branch: '',
//     customBranch: '',
//     mainMenu: '',
//     additionalMenus: [''],
//     openTime: '',
//     closeTime: '',
//     breakStartTime: '',
//     breakEndTime: '',
//     closedDays: [] as string[]
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showStorePassword, setShowStorePassword] = useState(false);
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);

//   const affiliationOptions = [
//     '컴퓨터공학과',
//     '경영학과',
//     '디자인학과',
//     '영어영문학과',
//     '심리학과',
//     '기계공학과',
//     '전자공학과',
//     '건축학과',
//     '화학과',
//     '수학과',
//     '기타'
//   ];

//   const branchOptions = [
//     '본점',
//     '강남점',
//     '홍대점',
//     '신촌점',
//     '이태원점',
//     '명동점',
//     '종로점',
//     '기타'
//   ];

//   const weekDays = [
//     { key: 'monday', label: '월' },
//     { key: 'tuesday', label: '화' },
//     { key: 'wednesday', label: '수' },
//     { key: 'thursday', label: '목' },
//     { key: 'friday', label: '금' },
//     { key: 'saturday', label: '토' },
//     { key: 'sunday', label: '일' }
//   ];

//   const handleNext = () => {
//     if (step === 1 && userType) {
//       setStep(2);
//     } else if (step === 2 && isValidStep2()) {
//       setStep(3);
//     } else if (step === 3 && userType === 'merchant' && isValidStep3()) {
//       setStep(4);
//     } else if (step === 4 && userType === 'merchant' && isValidStep4()) {
//       setStep(5);
//     } else if (step === 5 && userType === 'merchant' && isValidStep5()) {
//       setStep(6);
//     }
//   };

//   const isValidStep2 = () => {
//     if (userType === 'customer') {
//       return formData.email && formData.password && formData.confirmPassword;
//     } else {
//       return formData.storeEmail && formData.storePassword && formData.confirmPassword;
//     }
//   };

//   const isValidStep3 = () => {
//     if (userType === 'customer') {
//       return formData.name && formData.birthDate && formData.phone && formData.affiliation &&
//              (formData.affiliation !== '기타' || formData.customAffiliation);
//     } else {
//       return formData.businessNumber && formData.businessAddress && formData.storePhone && isPhoneVerified;
//     }
//   };

//   const isValidStep4 = () => {
//     return formData.storeName && formData.branch && (formData.branch !== '기타' || formData.customBranch);
//   };

//   const isValidStep5 = () => {
//     return formData.mainMenu && formData.additionalMenus.filter(menu => menu.trim()).length >= 0;
//   };

//   const isValidStep6 = () => {
//     return formData.openTime && formData.closeTime;
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (userType === 'customer' && formData.password !== formData.confirmPassword) {
//       alert('비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     if (userType === 'merchant' && formData.storePassword !== formData.confirmPassword) {
//       alert('비밀번호가 일치하지 않습니다.');
//       return;
//     }

//     setIsLoading(true);

//     // 회원가입 로직 시뮬레이션
//     setTimeout(() => {
//       setIsLoading(false);
//       navigate('/');
//     }, 2000);
//   };

//   const updateFormData = (field: string, value: string | string[]) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const addMenu = () => {
//     setFormData(prev => ({
//       ...prev,
//       additionalMenus: [...prev.additionalMenus, '']
//     }));
//   };

//   const updateMenu = (index: number, value: string) => {
//     const newMenus = [...formData.additionalMenus];
//     newMenus[index] = value;
//     setFormData(prev => ({ ...prev, additionalMenus: newMenus }));
//   };

//   const removeMenu = (index: number) => {
//     const newMenus = formData.additionalMenus.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, additionalMenus: newMenus }));
//   };

//   const sendVerification = () => {
//     setVerificationSent(true);
//     // 실제로는 SMS 인증 로직
//     setTimeout(() => {
//       alert('인증번호가 발송되었습니다.');
//     }, 500);
//   };

//   const verifyPhone = () => {
//     if (formData.phoneVerification === '1234') {
//       setIsPhoneVerified(true);
//       alert('휴대폰 인증이 완료되었습니다.');
//     } else {
//       alert('인증번호가 올바르지 않습니다.');
//     }
//   };

//   const toggleClosedDay = (day: string) => {
//     const newClosedDays = formData.closedDays.includes(day)
//       ? formData.closedDays.filter(d => d !== day)
//       : [...formData.closedDays, day];
//     updateFormData('closedDays', newClosedDays);
//   };

//   const totalSteps = userType === 'customer' ? 3 : 6;

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       {/* 헤더 */}
//       <div className="flex items-center justify-between p-4">
//         <button
//           onClick={() => step === 1 ? navigate('/auth/login') : setStep(step - 1)}
//           className="w-10 h-10 flex items-center justify-center"
//         >
//           <i className="ri-arrow-left-line text-text text-xl" />
//         </button>
//         <div className="flex items-center gap-2">
//           {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
//             <div
//               key={s}
//               className={`w-2 h-2 rounded-full ${
//                 step >= s ? 'bg-primary' : 'bg-gray-200'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 px-4 pb-8">
//         {/* Step 1: 사용자 유형 선택 */}
//         {step === 1 && (
//           <div className="space-y-8">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 어떤 서비스를 이용하시나요?
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 사용자 유형을 선택해주세요
//               </p>
//             </div>

//             <div className="space-y-4">
//               <Card
//                 className={`cursor-pointer transition-all ${
//                   userType === 'customer' ? 'border-2 border-primary bg-primary/5' : ''
//                 }`}
//                 onClick={() => setUserType('customer')}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
//                     <i className="ri-user-smile-line text-primary text-2xl" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold text-text mb-1">일반 사용자</h3>
//                     <p className="text-sm text-text-secondary font-sf">
//                       쿠폰과 스탬프를 받고 할인 혜택을 누려보세요
//                     </p>
//                   </div>
//                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     userType === 'customer' ? 'border-primary bg-primary' : 'border-gray-300'
//                   }`}>
//                     {userType === 'customer' && (
//                       <i className="ri-check-line text-white text-sm" />
//                     )}
//                   </div>
//                 </div>
//               </Card>

//               <Card
//                 className={`cursor-pointer transition-all ${
//                   userType === 'merchant' ? 'border-2 border-primary bg-primary/5' : ''
//                 }`}
//                 onClick={() => setUserType('merchant')}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
//                     <i className="ri-store-2-line text-accent text-2xl" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold text-text mb-1">점주</h3>
//                     <p className="text-sm text-text-secondary font-sf">
//                       매장을 등록하고 쿠폰을 발행해보세요
//                     </p>
//                   </div>
//                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     userType === 'merchant' ? 'border-primary bg-primary' : 'border-gray-300'
//                   }`}>
//                     {userType === 'merchant' && (
//                       <i className="ri-check-line text-white text-sm" />
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             <Button
//               fullWidth
//               onClick={handleNext}
//               disabled={!userType}
//             >
//               다음
//             </Button>
//           </div>
//         )}

//         {/* Step 2: 기본 정보 */}
//         {step === 2 && (
//           <div className="space-y-6">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 {userType === 'customer' ? '기본 정보를 입력해주세요' : '계정 정보를 입력해주세요'}
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 안전한 서비스 이용을 위해 필요합니다
//               </p>
//             </div>

//             <Card>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">이메일</label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       value={userType === 'customer' ? formData.email : formData.storeEmail}
//                       onChange={(e) => updateFormData(userType === 'customer' ? 'email' : 'storeEmail', e.target.value)}
//                       placeholder="이메일을 입력하세요"
//                       className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       required
//                     />
//                     <i className="ri-mail-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">비밀번호</label>
//                   <div className="relative">
//                     <input
//                       type={userType === 'customer' ? (showPassword ? 'text' : 'password') : (showStorePassword ? 'text' : 'password')}
//                       value={userType === 'customer' ? formData.password : formData.storePassword}
//                       onChange={(e) => updateFormData(userType === 'customer' ? 'password' : 'storePassword', e.target.value)}
//                       placeholder="비밀번호를 입력하세요"
//                       className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       required
//                     />
//                     <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     <button
//                       type="button"
//                       onClick={() => userType === 'customer' ? setShowPassword(!showPassword) : setShowStorePassword(!showStorePassword)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
//                     >
//                       <i className={(userType === 'customer' ? showPassword : showStorePassword) ? 'ri-eye-off-line' : 'ri-eye-line'} />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">비밀번호 확인</label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       value={formData.confirmPassword}
//                       onChange={(e) => updateFormData('confirmPassword', e.target.value)}
//                       placeholder="비밀번호를 다시 입력하세요"
//                       className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       required
//                     />
//                     <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
//                     >
//                       <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             <Button
//               fullWidth
//               onClick={handleNext}
//               disabled={!isValidStep2()}
//             >
//               다음
//             </Button>
//           </div>
//         )}

//         {/* Step 3: 상세 정보 (일반 사용자) 또는 사업자 정보 (점주) */}
//         {step === 3 && (
//           <div className="space-y-6">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 {userType === 'customer' ? '추가 정보를 입력해주세요' : '사업자 정보를 입력해주세요'}
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 {userType === 'customer' ? '맞춤 서비스 제공을 위해 필요합니다' : '사업자 등록을 위해 필요합니다'}
//               </p>
//             </div>

//             <Card>
//               {userType === 'customer' ? (
//                 <form onSubmit={handleSignup} className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">이름</label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={formData.name}
//                         onChange={(e) => updateFormData('name', e.target.value)}
//                         placeholder="이름을 입력하세요"
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-user-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">생년월일</label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         value={formData.birthDate}
//                         onChange={(e) => updateFormData('birthDate', e.target.value)}
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-calendar-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">전화번호</label>
//                     <div className="relative">
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) => updateFormData('phone', e.target.value)}
//                         placeholder="010-1234-5678"
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-phone-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">소속</label>
//                     <div className="relative">
//                       <select
//                         value={formData.affiliation}
//                         onChange={(e) => updateFormData('affiliation', e.target.value)}
//                         className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm appearance-none"
//                         required
//                       >
//                         <option value="">소속을 선택하세요</option>
//                         {affiliationOptions.map((option) => (
//                           <option key={option} value={option}>{option}</option>
//                         ))}
//                       </select>
//                       <i className="ri-building-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                       <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   {formData.affiliation === '기타' && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">소속 직접 입력</label>
//                       <div className="relative">
//                         <input
//                           type="text"
//                           value={formData.customAffiliation}
//                           onChange={(e) => updateFormData('customAffiliation', e.target.value)}
//                           placeholder="소속을 직접 입력하세요"
//                           className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                           required
//                         />
//                         <i className="ri-edit-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                       </div>
//                     </div>
//                   )}

//                   <Button
//                     type="submit"
//                     fullWidth
//                     disabled={isLoading}
//                     className="mt-6"
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         가입 중...
//                       </div>
//                     ) : (
//                       '회원가입 완료'
//                     )}
//                   </Button>
//                 </form>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">사업자등록번호</label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={formData.businessNumber}
//                         onChange={(e) => updateFormData('businessNumber', e.target.value)}
//                         placeholder="000-00-00000"
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-file-text-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">사업장 주소</label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={formData.businessAddress}
//                         onChange={(e) => updateFormData('businessAddress', e.target.value)}
//                         placeholder="사업장 주소를 입력하세요"
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-map-pin-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">전화번호</label>
//                     <div className="flex gap-2">
//                       <div className="relative flex-1">
//                         <input
//                           type="tel"
//                           value={formData.storePhone}
//                           onChange={(e) => updateFormData('storePhone', e.target.value)}
//                           placeholder="010-1234-5678"
//                           className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                           required
//                         />
//                         <i className="ri-phone-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                       </div>
//                       <Button
//                         type="button"
//                         variant="secondary"
//                         onClick={sendVerification}
//                         disabled={!formData.storePhone || verificationSent}
//                         className="px-4 whitespace-nowrap"
//                       >
//                         {verificationSent ? '발송완료' : '인증번호'}
//                       </Button>
//                     </div>
//                   </div>

//                   {verificationSent && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">인증번호</label>
//                       <div className="flex gap-2">
//                         <div className="relative flex-1">
//                           <input
//                             type="text"
//                             value={formData.phoneVerification}
//                             onChange={(e) => updateFormData('phoneVerification', e.target.value)}
//                             placeholder="인증번호 6자리"
//                             className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                             maxLength={6}
//                           />
//                           <i className="ri-shield-check-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                         </div>
//                         <Button
//                           type="button"
//                           onClick={verifyPhone}
//                           disabled={!formData.phoneVerification || isPhoneVerified}
//                           className="px-4 whitespace-nowrap"
//                         >
//                           {isPhoneVerified ? '인증완료' : '확인'}
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   <Button
//                     fullWidth
//                     onClick={handleNext}
//                     disabled={!isValidStep3()}
//                     className="mt-6"
//                   >
//                     다음
//                   </Button>
//                 </div>
//               )}
//             </Card>
//           </div>
//         )}

//         {/* Step 4: 가게 정보 (점주만) */}
//         {step === 4 && userType === 'merchant' && (
//           <div className="space-y-6">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 가게 정보를 입력해주세요
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 고객들이 찾을 수 있는 가게 정보입니다
//               </p>
//             </div>

//             <Card>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">가게 이름</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={formData.storeName}
//                       onChange={(e) => updateFormData('storeName', e.target.value)}
//                       placeholder="가게 이름을 입력하세요"
//                       className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       required
//                     />
//                     <i className="ri-store-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">지점 선택</label>
//                   <div className="relative">
//                     <select
//                       value={formData.branch}
//                       onChange={(e) => updateFormData('branch', e.target.value)}
//                       className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm appearance-none"
//                       required
//                     >
//                       <option value="">지점을 선택하세요</option>
//                       {branchOptions.map((option) => (
//                         <option key={option} value={option}>{option}</option>
//                       ))}
//                     </select>
//                     <i className="ri-map-pin-2-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                   </div>
//                 </div>

//                 {formData.branch === '기타' && (
//                   <div className="space-y-2">
//                     <label className="text-sm font-sf font-medium text-text">지점명 직접 입력</label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={formData.customBranch}
//                         onChange={(e) => updateFormData('customBranch', e.target.value)}
//                         placeholder="지점명을 직접 입력하세요"
//                         className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                       <i className="ri-edit-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             <Button
//               fullWidth
//               onClick={handleNext}
//               disabled={!isValidStep4()}
//             >
//               다음
//             </Button>
//           </div>
//         )}

//         {/* Step 5: 메뉴 정보 (점주만) */}
//         {step === 5 && userType === 'merchant' && (
//           <div className="space-y-6">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 주요 메뉴를 입력해주세요
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 최소 1개 이상의 메뉴를 입력해주세요
//               </p>
//             </div>

//             <Card>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-sf font-medium text-text">대표 메뉴 *</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={formData.mainMenu}
//                       onChange={(e) => updateFormData('mainMenu', e.target.value)}
//                       placeholder="대표 메뉴를 입력하세요"
//                       className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       required
//                     />
//                     <i className="ri-restaurant-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <label className="text-sm font-sf font-medium text-text">추가 메뉴</label>
//                     <button
//                       type="button"
//                       onClick={addMenu}
//                       className="text-primary text-sm font-sf flex items-center gap-1"
//                     >
//                       <i className="ri-add-line" />
//                       메뉴 추가
//                     </button>
//                   </div>

//                   {formData.additionalMenus.map((menu, index) => (
//                     <div key={index} className="flex gap-2">
//                       <div className="relative flex-1">
//                         <input
//                           type="text"
//                           value={menu}
//                           onChange={(e) => updateMenu(index, e.target.value)}
//                           placeholder={`추가 메뉴 ${index + 1}`}
//                           className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         />
//                         <i className="ri-restaurant-2-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeMenu(index)}
//                         className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-red-500"
//                       >
//                         <i className="ri-delete-bin-line" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </Card>

//             <Button
//               fullWidth
//               onClick={handleNext}
//               disabled={!isValidStep5()}
//             >
//               다음
//             </Button>
//           </div>
//         )}

//         {/* Step 6: 운영시간 (점주만) */}
//         {step === 6 && userType === 'merchant' && (
//           <div className="space-y-6">
//             <div className="text-center space-y-2">
//               <h1 className="text-2xl font-bold text-text">
//                 운영시간을 설정해주세요
//               </h1>
//               <p className="text-text-secondary font-sf">
//                 고객들이 방문할 수 있는 시간을 알려주세요
//               </p>
//             </div>

//             <Card>
//               <form onSubmit={handleSignup} className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">오픈 시간</label>
//                       <input
//                         type="time"
//                         value={formData.openTime}
//                         onChange={(e) => updateFormData('openTime', e.target.value)}
//                         className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">마감 시간</label>
//                       <input
//                         type="time"
//                         value={formData.closeTime}
//                         onChange={(e) => updateFormData('closeTime', e.target.value)}
//                         className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">브레이크 시작</label>
//                       <input
//                         type="time"
//                         value={formData.breakStartTime}
//                         onChange={(e) => updateFormData('breakStartTime', e.target.value)}
//                         className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-sf font-medium text-text">브레이크 종료</label>
//                       <input
//                         type="time"
//                         value={formData.breakEndTime}
//                         onChange={(e) => updateFormData('breakEndTime', e.target.value)}
//                         className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-sm font-sf font-medium text-text">휴무일</label>
//                   <div className="grid grid-cols-7 gap-2">
//                     {weekDays.map((day) => (
//                       <button
//                         key={day.key}
//                         type="button"
//                         onClick={() => toggleClosedDay(day.key)}
//                         className={`aspect-square rounded-12 text-sm font-sf font-medium transition-all ${
//                           formData.closedDays.includes(day.key)
//                             ? 'bg-red-500 text-white'
//                             : 'bg-gray-100 text-text hover:bg-gray-200'
//                         }`}
//                       >
//                         {day.label}
//                       </button>
//                     ))}
//                   </div>
//                   <p className="text-xs text-text-secondary font-sf">
//                     휴무일을 선택하세요 (빨간색으로 표시됩니다)
//                   </p>
//                 </div>

//                 <Button
//                   type="submit"
//                   fullWidth
//                   disabled={isLoading || !isValidStep6()}
//                   className="mt-6"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       가입 중...
//                     </div>
//                   ) : (
//                     '회원가입 완료'
//                   )}
//                 </Button>
//               </form>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/base/Button";
import Card from "../../../components/base/Card";

type UserType = "customer" | "merchant";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    birthDate: "",
    affiliation: "",
    customAffiliation: "",
    businessName: "",
    businessNumber: "",
    businessAddress: "",
    storeName: "",
    storePhone: "",
    storeEmail: "",
    storePassword: "",
    phoneVerification: "",
    branch: "",
    customBranch: "",
    mainMenu: "",
    additionalMenus: [""],
    openTime: "",
    closeTime: "",
    breakStartTime: "",
    breakEndTime: "",
    closedDays: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStorePassword, setShowStorePassword] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const affiliationOptions = [
    "컴퓨터공학과",
    "경영학과",
    "디자인학과",
    "영어영문학과",
    "심리학과",
    "기계공학과",
    "전자공학과",
    "건축학과",
    "화학과",
    "수학과",
    "기타",
  ];

  const branchOptions = [
    "본점",
    "강남점",
    "홍대점",
    "신촌점",
    "이태원점",
    "명동점",
    "종로점",
    "기타",
  ];

  const weekDays = [
    { key: "monday", label: "월" },
    { key: "tuesday", label: "화" },
    { key: "wednesday", label: "수" },
    { key: "thursday", label: "목" },
    { key: "friday", label: "금" },
    { key: "saturday", label: "토" },
    { key: "sunday", label: "일" },
  ];

  const handleNext = () => {
    if (step === 1 && userType) {
      setStep(2);
    } else if (step === 2 && isValidStep2()) {
      if (
        userType === "customer" &&
        formData.password !== formData.confirmPassword
      ) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (
        userType === "merchant" &&
        formData.storePassword !== formData.confirmPassword
      ) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      setStep(3);
    } else if (step === 3 && userType === "merchant" && isValidStep3()) {
      setStep(4);
    } else if (step === 4 && userType === "merchant" && isValidStep4()) {
      setStep(5);
      // } else if (step === 5 && userType === 'merchant' && isValidStep5()) {
      //   setStep(6);
      // }
    } else if (step === 5 && userType === "merchant") {
      setStep(6);
    }
  };

  const isValidStep2 = () => {
    if (userType === "customer") {
      return formData.email && formData.password && formData.confirmPassword;
    } else {
      return (
        formData.storeEmail &&
        formData.storePassword &&
        formData.confirmPassword
      );
    }
  };

  const isValidStep3 = () => {
    if (userType === "customer") {
      return (
        formData.name &&
        formData.birthDate &&
        formData.phone &&
        formData.affiliation &&
        (formData.affiliation !== "기타" || formData.customAffiliation)
      );
    } else {
      return (
        formData.businessNumber &&
        formData.businessAddress &&
        formData.storePhone &&
        isPhoneVerified
      );
    }
  };

  const isValidStep4 = () => {
    return (
      formData.storeName &&
      formData.branch &&
      (formData.branch !== "기타" || formData.customBranch)
    );
  };

  // 필수
  // const isValidStep5 = () => {
  //   return formData.mainMenu && formData.additionalMenus.filter(menu => menu.trim()).length >= 0;
  // };

  // 선택
  const isValidStep5 = () => true;

  const isValidStep6 = () => {
    return formData.openTime && formData.closeTime;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // 회원가입 로직 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addMenu = () => {
    setFormData((prev) => ({
      ...prev,
      additionalMenus: [...prev.additionalMenus, ""],
    }));
  };

  const updateMenu = (index: number, value: string) => {
    const newMenus = [...formData.additionalMenus];
    newMenus[index] = value;
    setFormData((prev) => ({ ...prev, additionalMenus: newMenus }));
  };

  const removeMenu = (index: number) => {
    const newMenus = formData.additionalMenus.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, additionalMenus: newMenus }));
  };

  const sendVerification = () => {
    setVerificationSent(true);
    // 실제로는 SMS 인증 로직
    setTimeout(() => {
      alert("인증번호가 발송되었습니다.");
    }, 500);
  };

  const verifyPhone = () => {
    if (formData.phoneVerification === "1234") {
      setIsPhoneVerified(true);
      alert("휴대폰 인증이 완료되었습니다.");
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const toggleClosedDay = (day: string) => {
    const newClosedDays = formData.closedDays.includes(day)
      ? formData.closedDays.filter((d) => d !== day)
      : [...formData.closedDays, day];
    updateFormData("closedDays", newClosedDays);
  };

  const totalSteps = userType === "customer" ? 3 : 6;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() =>
            step === 1 ? navigate("/auth/login") : setStep(step - 1)
          }
          className="w-10 h-10 flex items-center justify-center"
        >
          <i className="ri-arrow-left-line text-text text-xl" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${
                step >= s ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pb-8">
        {/* Step 1: 사용자 유형 선택 */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                어떤 서비스를 이용하시나요?
              </h1>
              <p className="text-text-secondary font-sf">
                사용자 유형을 선택해주세요
              </p>
            </div>

            <div className="space-y-4">
              <Card
                className={`cursor-pointer transition-all ${
                  userType === "customer"
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setUserType("customer")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <i className="ri-user-smile-line text-primary text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text mb-1">
                      일반 사용자
                    </h3>
                    <p className="text-sm text-text-secondary font-sf">
                      쿠폰과 스탬프를 받고 할인 혜택을 누려보세요
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userType === "customer"
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {userType === "customer" && (
                      <i className="ri-check-line text-white text-sm" />
                    )}
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  userType === "merchant"
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => setUserType("merchant")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <i className="ri-store-2-line text-accent text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text mb-1">점주</h3>
                    <p className="text-sm text-text-secondary font-sf">
                      매장을 등록하고 쿠폰을 발행해보세요
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userType === "merchant"
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {userType === "merchant" && (
                      <i className="ri-check-line text-white text-sm" />
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <Button fullWidth onClick={handleNext} disabled={!userType}>
              다음
            </Button>
          </div>
        )}

        {/* Step 2: 기본 정보 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                {userType === "customer"
                  ? "기본 정보를 입력해주세요"
                  : "계정 정보를 입력해주세요"}
              </h1>
              <p className="text-text-secondary font-sf">
                안전한 서비스 이용을 위해 필요합니다
              </p>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    이메일
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={
                        userType === "customer"
                          ? formData.email
                          : formData.storeEmail
                      }
                      onChange={(e) =>
                        updateFormData(
                          userType === "customer" ? "email" : "storeEmail",
                          e.target.value
                        )
                      }
                      placeholder="이메일을 입력하세요"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      required
                    />
                    <i className="ri-mail-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type={
                        userType === "customer"
                          ? showPassword
                            ? "text"
                            : "password"
                          : showStorePassword
                          ? "text"
                          : "password"
                      }
                      value={
                        userType === "customer"
                          ? formData.password
                          : formData.storePassword
                      }
                      onChange={(e) =>
                        updateFormData(
                          userType === "customer"
                            ? "password"
                            : "storePassword",
                          e.target.value
                        )
                      }
                      placeholder="비밀번호를 입력하세요"
                      className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      required
                    />
                    <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <button
                      type="button"
                      onClick={() =>
                        userType === "customer"
                          ? setShowPassword(!showPassword)
                          : setShowStorePassword(!showStorePassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    >
                      <i
                        className={
                          (
                            userType === "customer"
                              ? showPassword
                              : showStorePassword
                          )
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        }
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      required
                    />
                    <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    >
                      <i
                        className={
                          showConfirmPassword
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Button fullWidth onClick={handleNext} disabled={!isValidStep2()}>
              다음
            </Button>
          </div>
        )}

        {/* Step 3: 상세 정보 (일반 사용자) 또는 사업자 정보 (점주) */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                {userType === "customer"
                  ? "추가 정보를 입력해주세요"
                  : "사업자 정보를 입력해주세요"}
              </h1>
              <p className="text-text-secondary font-sf">
                {userType === "customer"
                  ? "맞춤 서비스 제공을 위해 필요합니다"
                  : "사업자 등록을 위해 필요합니다"}
              </p>
            </div>

            <Card>
              {userType === "customer" ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      이름
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="이름을 입력하세요"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-user-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      생년월일
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          updateFormData("birthDate", e.target.value)
                        }
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-calendar-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      전화번호
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        placeholder="010-1234-5678"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-phone-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      소속
                    </label>
                    <div className="relative">
                      <select
                        value={formData.affiliation}
                        onChange={(e) =>
                          updateFormData("affiliation", e.target.value)
                        }
                        className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm appearance-none"
                        required
                      >
                        <option value="">소속을 선택하세요</option>
                        {affiliationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <i className="ri-building-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  {formData.affiliation === "기타" && (
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        소속 직접 입력
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.customAffiliation}
                          onChange={(e) =>
                            updateFormData("customAffiliation", e.target.value)
                          }
                          placeholder="소속을 직접 입력하세요"
                          className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                          required
                        />
                        <i className="ri-edit-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    className="mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        가입 중...
                      </div>
                    ) : (
                      "회원가입 완료"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      사업자등록번호
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.businessNumber}
                        onChange={(e) =>
                          updateFormData("businessNumber", e.target.value)
                        }
                        placeholder="000-00-00000"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-file-text-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      사업장 주소
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.businessAddress}
                        onChange={(e) =>
                          updateFormData("businessAddress", e.target.value)
                        }
                        placeholder="사업장 주소를 입력하세요"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-map-pin-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      전화번호
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={formData.storePhone}
                          onChange={(e) =>
                            updateFormData("storePhone", e.target.value)
                          }
                          placeholder="010-1234-5678"
                          className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                          required
                        />
                        <i className="ri-phone-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={sendVerification}
                        disabled={!formData.storePhone || verificationSent}
                        className="px-4 whitespace-nowrap"
                      >
                        {verificationSent ? "발송완료" : "인증번호"}
                      </Button>
                    </div>
                  </div>

                  {verificationSent && (
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        인증번호
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={formData.phoneVerification}
                            onChange={(e) =>
                              updateFormData(
                                "phoneVerification",
                                e.target.value
                              )
                            }
                            placeholder="인증번호 6자리"
                            className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                            maxLength={6}
                          />
                          <i className="ri-shield-check-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                        </div>
                        <Button
                          type="button"
                          onClick={verifyPhone}
                          disabled={
                            !formData.phoneVerification || isPhoneVerified
                          }
                          className="px-4 whitespace-nowrap"
                        >
                          {isPhoneVerified ? "인증완료" : "확인"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    fullWidth
                    onClick={handleNext}
                    disabled={!isValidStep3()}
                    className="mt-6"
                  >
                    다음
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Step 4: 가게 정보 (점주만) */}
        {step === 4 && userType === "merchant" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                가게 정보를 입력해주세요
              </h1>
              <p className="text-text-secondary font-sf">
                고객들이 찾을 수 있는 가게 정보입니다
              </p>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    가게 이름
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) =>
                        updateFormData("storeName", e.target.value)
                      }
                      placeholder="가게 이름을 입력하세요"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      required
                    />
                    <i className="ri-store-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    지점 선택
                  </label>
                  <div className="relative">
                    <select
                      value={formData.branch}
                      onChange={(e) => updateFormData("branch", e.target.value)}
                      className="w-full p-4 pl-12 pr-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm appearance-none"
                      required
                    >
                      <option value="">지점을 선택하세요</option>
                      {branchOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <i className="ri-map-pin-2-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  </div>
                </div>

                {formData.branch === "기타" && (
                  <div className="space-y-2">
                    <label className="text-sm font-sf font-medium text-text">
                      지점명 직접 입력
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.customBranch}
                        onChange={(e) =>
                          updateFormData("customBranch", e.target.value)
                        }
                        placeholder="지점명을 직접 입력하세요"
                        className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                      <i className="ri-edit-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Button fullWidth onClick={handleNext} disabled={!isValidStep4()}>
              다음
            </Button>
          </div>
        )}

        {/* Step 5: 메뉴 정보 (점주만) */}
        {step === 5 && userType === "merchant" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                주요 메뉴를 입력해주세요
              </h1>
              <p className="text-text-secondary font-sf">
                {/* 최소 1개 이상의 메뉴를 입력해주세요 */}
                메뉴를 입력해주세요 (선택)
              </p>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-sf font-medium text-text">
                    대표 메뉴
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.mainMenu}
                      onChange={(e) =>
                        updateFormData("mainMenu", e.target.value)
                      }
                      placeholder="대표 메뉴를 입력하세요"
                      className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      required
                    />
                    <i className="ri-restaurant-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-sf font-medium text-text">
                      추가 메뉴
                    </label>
                    <button
                      type="button"
                      onClick={addMenu}
                      className="text-primary text-sm font-sf flex items-center gap-1"
                    >
                      <i className="ri-add-line" />
                      메뉴 추가
                    </button>
                  </div>

                  {formData.additionalMenus.map((menu, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={menu}
                          onChange={(e) => updateMenu(index, e.target.value)}
                          placeholder={`추가 메뉴 ${index + 1}`}
                          className="w-full p-4 pl-12 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        />
                        <i className="ri-restaurant-2-line absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMenu(index)}
                        className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-red-500"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* <Button 
              fullWidth 
              onClick={handleNext}
              disabled={!isValidStep5()}
            >
              다음
            </Button> */}
            <Button fullWidth onClick={handleNext}>
              다음
            </Button>
          </div>
        )}

        {/* Step 6: 운영시간 (점주만) */}
        {step === 6 && userType === "merchant" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-text">
                운영시간을 설정해주세요
              </h1>
              <p className="text-text-secondary font-sf">
                고객들이 방문할 수 있는 시간을 알려주세요
              </p>
            </div>

            <Card>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        오픈 시간
                      </label>
                      <input
                        type="time"
                        value={formData.openTime}
                        onChange={(e) =>
                          updateFormData("openTime", e.target.value)
                        }
                        className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        마감 시간
                      </label>
                      <input
                        type="time"
                        value={formData.closeTime}
                        onChange={(e) =>
                          updateFormData("closeTime", e.target.value)
                        }
                        className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        브레이크 시작
                      </label>
                      <input
                        type="time"
                        value={formData.breakStartTime}
                        onChange={(e) =>
                          updateFormData("breakStartTime", e.target.value)
                        }
                        className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-sf font-medium text-text">
                        브레이크 종료
                      </label>
                      <input
                        type="time"
                        value={formData.breakEndTime}
                        onChange={(e) =>
                          updateFormData("breakEndTime", e.target.value)
                        }
                        className="w-full p-4 border border-gray-200 rounded-12 focus:border-primary focus:outline-none font-sf text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-sf font-medium text-text">
                    휴무일
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleClosedDay(day.key)}
                        className={`aspect-square rounded-12 text-sm font-sf font-medium transition-all ${
                          formData.closedDays.includes(day.key)
                            ? "bg-red-500 text-white"
                            : "bg-gray-100 text-text hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary font-sf">
                    휴무일을 선택하세요 (빨간색으로 표시됩니다)
                  </p>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading || !isValidStep6()}
                  className="mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      가입 중...
                    </div>
                  ) : (
                    "회원가입 완료"
                  )}
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
