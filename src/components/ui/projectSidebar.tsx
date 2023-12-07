'use client';
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  PhotoIcon,
  ViewColumnsIcon,
  LanguageIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline'
// import { LayerAlt04 } from "untitledui-js/icons/layout"
import {General} from "untitledui-js"
import {LayerAlt04} from "untitledui-js/icons/layout"


const navigation = [
  { name: 'Logos', href: '#', icon: PaintBrushIcon, current: false },
  {
    name: 'Typography',
    icon: LanguageIcon,
    current: false,
    children: [
      { name: 'Engineering', href: '#', current: false },
      { name: 'Human Resources', href: '#', current: false },
      { name: 'Customer Success', href: '#', current: false },
    ],
  },
  {
    name: 'Assets',
    icon: PhotoIcon,
    current: false,
    children: [
      { name: 'GraphQL API', href: '#', current: false },
      { name: 'iOS App', href: '#', current: false },
      { name: 'Android App', href: '#', current: false },
      { name: 'New Customer Portal', href: '#', current: false },
    ],
  },
  { name: 'Template', href: '#', icon: ViewColumnsIcon, current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProjectSidebar() {
  return (
    <div className="flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-gray-900 px-6 h-full">
{/* <div className="flex-grow"> */}
        {/* <span><LayerAlt04 size="24px" stroke="1px" pathProps={{stroke: "#9ca3af"}} /> </span> */}
      <nav className="flex flex-1 flex-col h-full">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-800' : 'hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current ? 'bg-gray-50' : 'hover:bg-gray-800',
                              'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-white'
                            )}
                          >
                            <item.icon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                            {item.name}
                            <ChevronRightIcon
                              className={classNames(
                                open ? 'rotate-90 text-gray-500' : 'text-white',
                                'ml-auto h-5 w-5 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel as="ul" className="mt-1 px-2">
                            {item.children.map((subItem) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <Disclosure.Button
                                  as="a"
                                  href={subItem.href}
                                  className={classNames(
                                    subItem.current ? 'bg-gray-50' : 'hover:bg-gray-800',
                                    'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-white'
                                  )}
                                >
                                  {subItem.name}
                                </Disclosure.Button>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
          <li className="-mx-6 mt-auto">
            <a
              href="#"
              className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-800"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">Tom Cook</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
