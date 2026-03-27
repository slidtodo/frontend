import MyPageForm from './MyPageForm';

export default function MyPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="w-[400px] text-xl font-bold text-gray-900">내 정보 관리</h1>
      <MyPageForm />
    </div>
  );
}
