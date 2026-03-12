'use client'
import { useState } from 'react'
import Image from 'next/image'
import Input from '@/shared/components/Input'
import Button from '@/shared/components/Button'
import FormField from '@/shared/components/FormField'

export default function MyPage() {
    const [email] = useState('codeit@email.com')
    const [name, setName] = useState('체다치즈')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

    const isSocialLogin = false

    return (
        <div className="flex flex-col gap-6 p-6 items-center">
            <h1 className="text-xl font-bold text-gray-900 w-[400px]">내 정보 관리</h1>

            <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 w-[400px]">
                {/* 프로필 이미지 */}
                <div className="flex justify-center">
                    <div className="relative">
                        <Image
                            src="/icons/image.png"
                            alt="프로필"
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF8442] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✎</span>
                        </button>
                    </div>
                </div>

                {/* 이메일 */}
                <FormField label="이메일">
                    <Input
                        type="email"
                        value={email}
                        disabled
                    />
                </FormField>

                {/* 이름 */}
                <FormField label="이름">
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormField>

                {/* 비밀번호 변경 - 소셜 로그인이면 숨김 */}
                {!isSocialLogin && (
                    <FormField label="비밀번호 변경">
                        <div className="flex flex-col gap-2">
                            <Input
                                type="password"
                                placeholder="현재 비밀번호를 입력해주세요"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="새 비밀번호를 다시 입력해주세요"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            />
                        </div>
                    </FormField>
                )}

                {/* 저장하기 버튼 */}
                <Button variant="primary" type="submit" className="w-full h-[56px]">
                    저장하기
                </Button>
            </div>
        </div>
    )
}