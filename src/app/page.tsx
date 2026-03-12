import PageHeader from '@/shared/components/PageHeader';

export default function Home() {
  return (
    <>
      {/* <div className="mx-auto flex h-screen w-150 flex-col justify-center"> */}
      <PageHeader title={'체다치즈님의 대시보드'} />
      <PageHeader title={'찜한 할 일'} count={6} />
      {/* </div> */}
    </>
  );
}
