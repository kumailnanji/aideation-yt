'use client';
import { DocumentIcon, CheckIcon, ChevronDownIcon, TrashIcon } from "@heroicons/react/24/solid"
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
// import "../app/globals.css"

const type = [
    { id: 0, name: 'Choose logo type' },
    { id: 1, name: 'Monogram' },
    { id: 2, name: 'Wordmark' },
    { id: 3, name: 'Full Logo' },
]

interface FileUploadProps {
    files: any[];
    onFileTypesSelected: (fileName: string, logoType: string) => void;
    onDeleteFile: (fileName: string) => void;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function FileUpload({ files, onFileTypesSelected, onDeleteFile }: FileUploadProps) {
    // const [selected, setSelected] = useState(type[0])
    const [selectedTypes, setSelectedTypes] = useState<Record<string, string>>({});
    const [animateProgressBar, setAnimateProgressBar] = useState(false);


    function handleAnimationEnd() {
        setAnimateProgressBar(false);
    }

    function isLogoType(obj: any): obj is { id: number; name: string } {
        return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
    }

    return (
        <div>
            {files.map((file: any) => {
                console.log("files iniside fileUpload", file)

                const selected = selectedTypes[file.file.name] || type[0];
                return (
                    <div key={file.name} onAnimationEnd={handleAnimationEnd} className={`flex w-full items-center content-center justify-between mt-4 border-gray-800 border-[1px] p-4 rounded-md ${animateProgressBar ? "progressBarAnimation" : ""} bg-gray-900`}>
                        <div className="flex gap-4 items-center w-full">
                            <DocumentIcon className="h-8 w-8 text-indigo-500" />
                            <div>
                                <p className="text-gray-300 text-sm">{file.file.name}</p>
                                <p className="text-gray-500 text-sm">{((file.file.size) / 1024).toFixed(2)}KB</p>
                            </div>

                        </div>
                        <Listbox value={selected} onChange={(value) => {
                            setSelectedTypes((prev) => {
                                const updated = { ...prev, [file.file.name]: value };
                                onFileTypesSelected(file.file.name, (value as { id: number; name: string; }).name);
                                return updated;
                            });
                        }}>
                            {({ open }) => (
                                <>
                                    <div className="relative w-3/4">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md  py-1.5 pl-3 pr-10 text-left text-gray-300 shadow-sm ring-1 ring-inset ring-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                            <span className="block truncate">
                                                {isLogoType(selected) && selected.name === "Choose logo type" ? (
                                                    <span className="text-gray-700">{selected.name}</span>
                                                ) : (
                                                    isLogoType(selected) ? selected.name : ""
                                                )}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            enter="transition ease-in duration-25"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-gray-800 ring-opacity-5 focus:outline-none sm:text-sm">
                                                {type.map((typeItem) => (
                                                    typeItem.id !== 0 && (
                                                        <Listbox.Option
                                                            key={`${file.file.name}-${typeItem.name}`}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'bg-indigo-600 text-gray-300' : 'text-gray-300',
                                                                    'relative cursor-default select-none py-2 pl-8 pr-4'
                                                                )
                                                            }
                                                            value={typeItem}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                        {typeItem.name}
                                                                    </span>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active ? 'text-white' : 'text-indigo-600',
                                                                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                                                            )}
                                                                        >
                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    )
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                        <button onClick={() => onDeleteFile(file.file.name)} className=" pl-3 rounded"><TrashIcon className="h-5 w-5 text-gray-500 hover:text-red-500" /></button>
                    </div>
                )
            })}
        </div>
    )
}
