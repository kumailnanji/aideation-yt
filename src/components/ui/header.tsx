'use client';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import ShareButton from './shareButton';
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'


const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

interface ShowcaseProps {
    projectName: number | string,
    userId: any,
    projectId: number | string;
}

export default function Header({ projectName, userId, projectId }: ShowcaseProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [open, setOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    const viewerUserId = userId.slice(5)
    const shareLink = `localhost:3000/project/${projectName}?projectId=${projectId}&type=viewer&t=${viewerUserId}`


    function copyToClipboard() {
        navigator.clipboard.writeText(shareLink)
        setIsCopied(true)
    }



    return (
        <header className="bg-gray-900 w-screen">
            <nav className="mx-auto flex items-center justify-between gap-x-6 px-6 py-4" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/dashboard" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-8 w-auto" src="/brandbook.svg" alt="" />
                    </Link>
                </div>
                <div className="hidden lg:flex lg:gap-x-2">
                    <Link href="/dashboard" className="text-sm font-regular leading-6 text-gray-600 ">
                        <span className='hover:text-gray-500'>Projects</span> /
                    </Link>
                    <p className="text-sm font-regular leading-6 text-gray-100">{projectName}</p>
                    {/* {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-100">
              {item.name}
            </a>
          ))} */}
                </div>
                <div className="flex flex-1 items-center justify-end gap-x-6">
                    {/* <a
                        href={`/project/${projectName}?projectId=${projectId}&type=viewer&t=${viewerUserId}`}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        target='_blank'
                    >
                        Share
                    </a> */}
                    <button onClick={() => setOpen(true)} className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                        Share
                    </button>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </nav>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-300">
                                                Congratulations!
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    It’s time to handoff your hard work to your client! Here’s a shareable link you can send to them.
                                                </p>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm mt-4 font-medium leading-6 text-left text-gray-300">
                                                        Share Link
                                                    </label>
                                                    <div className="mt-2 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={shareLink}
                                                            id="shareLink"
                                                            className="block w-full px-2 rounded-md border-0 py-1.5 bg-gray-900 ring-1 ring-inset ring-gray-800 text-gray-300 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                            readOnly={true}
                                                            autoFocus={false}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='py-2'
                                                            onClick={copyToClipboard}
                                                        // className="rounded bg-white/10 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white/20"
                                                        >
                                                            {isCopied ?
                                                                <p className='text-gray-500 flex gap-2 justify-center items-center'><CheckCircleIcon className='-ml-0.5 h-4 w-4'/> Copied!</p>
                                                                :
                                                                <ClipboardDocumentIcon className="-ml-0.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                                                            }

                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => (setOpen(false), setIsCopied(false))}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </header>
    )
}
