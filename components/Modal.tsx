'use client';

import { addUserEmailToProduct } from '@/lib/actions';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import Image from 'next/image';
import { FormEvent, Fragment, useState } from 'react';

interface Props {
  productId: string
}

const Modal = ({ productId }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false);
    setEmail('');
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} type='button' className='btn'>
          Track
      </button>


      <Transition appear show={isOpen} as={Fragment}>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <DialogPanel className="max-w-[600px] space-y-4 bg-white p-6 rounded-xl">
              <div className='flex justify-between'>
                <div className='border border-gray-300 w-fit p-3 rounded-lg'>
                  <Image
                    src='/assets/icons/logo.svg'
                    alt='price tag'
                    width={26}
                    height={26}
                  />
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <Image
                    src='/assets/icons/x-close.svg'
                    alt='close button'
                    width={26}
                    height={26}
                  />
                </button>
              </div>
              <DialogTitle className="text-gray-800 font-semibold text-[1.1rem]">Stay updated with product pricing alerts right in your inbox!</DialogTitle>
              <p className="text-gray-600 text-[0.9rem]">Never miss a bargain again with our timely alerts!</p>
              <form action="" className='flex flex-col' onSubmit={handleSubmit}>
                <label htmlFor='email' className='text-gray-700 text-[0.9rem] font-semibold'>Email address</label>
                <div className="dialog-input_container">
                  <Image 
                    src="/assets/icons/mail.svg"
                    alt='mail'
                    width={18}
                    height={18}
                  />

                  <input 
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className='dialog-input'
                  />
                </div>
                <button type='submit' className='dialog-btn'>
                  {isSubmitting ? 'Submitting...' : 'Track'}
                </button>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;