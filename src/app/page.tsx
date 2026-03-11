// app/page.tsx
import Button from '@/shared/components/Button'
import { Plus } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <Button variant="primary" className="w-[223px] h-[56px] text-lg">
        시작하기
      </Button>
      <Button variant="primary" className="w-[400px] h-[56px] text-lg">
        로그인하기
      </Button>
      <Button variant="secondary" className="w-[120px] h-[40px] flex items-center gap-1 text-sm">
        <Plus size={16} />
        할 일 추가
      </Button>
      <Button variant="icon" className="w-[40px] h-[40px]">
        <Plus size={20} />
      </Button>
      <Button variant="danger" className="w-[120px] h-[40px] text-sm">
        등록하기
      </Button>
    </div>
  )
}