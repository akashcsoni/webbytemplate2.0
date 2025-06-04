"use client";

import {
  Button,
  Checkbox,
  Image,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import React from "react";

const page = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <h1 className="h2 mb-5 mt-[30px]">Become an Author</h1>
      <div className="flex items-center justify-between lg:flex-row flex-col 2xl:gap-[148px] 1xl:gap-[85px] xl:gap-[50px] sm:gap-6 gap-4 border border-primary/10 rounded-md overflow-hidden mb-[20px] bg-white 1xl:p-[50px] xl:p-10 sm:p-6 p-4">
        <div className="lg:w-1/2">
          <h1 className="h2 1xl:mb-7 xl:mb-[18px] mb-2">Let's get started!</h1>
          <p className="!font-normal 2xl:text-xl 1xl:text-[19px] xl:text-lg sm:text-base text-[15px] sm:leading-[30px] leading-[22px] 1xl:mb-6 xl:mb-4 mb-3 text-black">
            We are currently open for new Authors who specialize in:
          </p>
          <ul className="1xl:mb-6 mb-4 1xl:space-y-3 space-y-2">
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">HTML Templates</p>
            </li>
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">Headless Templates</p>
            </li>
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">UI Templates</p>
            </li>
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">Plugins</p>
            </li>
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">Graphics</p>
            </li>
            <li className="flex items-center justify-start gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                className="xl:w-[17px] xl:h-[17px] w-[15px] h-[15px]"
              >
                <g clipPath="url(#clip0_4840_838)">
                  <path
                    opacity="0.4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5 1.30769C4.52779 1.30769 1.30769 4.52779 1.30769 8.5C1.30769 12.4722 4.52779 15.6923 8.5 15.6923C12.4722 15.6923 15.6923 12.4722 15.6923 8.5C15.6923 4.52779 12.4722 1.30769 8.5 1.30769ZM0 8.5C0 3.80558 3.80558 0 8.5 0C13.1945 0 17 3.80558 17 8.5C17 13.1945 13.1945 17 8.5 17C3.80558 17 0 13.1945 0 8.5Z"
                    fill="#0156D5"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.5395 5.69311L7.65485 11.5777C7.53223 11.7004 7.36592 11.7692 7.1925 11.7692C7.01909 11.7692 6.85279 11.7004 6.73017 11.5777L3.46094 8.3085L4.38562 7.38383L7.1925 10.1907L12.6148 4.76843L13.5395 5.69311Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <p className="p2">Stock Photos</p>
            </li>
          </ul>

          <p className="p2 1xl:mb-[22px] mb-4">
            We are currently accepting new authors across all categories. To
            express your interest and get started, please proceed to the next
            step.
          </p>

          <div className="flex items-start justify-start w-full 1xl:mb-[26px] mb-4">
            <Checkbox
              classNames={{
                base: "bg-white hover:!bg-white flex items-start",
                label: "p2 italic",
                wrapper:
                  "hover:!bg-white sm:w-[18px] sm:h-[18px] w-4 h-4 mt-0.5 !rounded-none",
              }}
              radius="sm"
            >
              I confirm that I am 18 years of age or older and agree to the
              WebbyTemplate{" "}
              <Link
                href="javascript:;"
                className="2xl:text-base md:text-[15px] text-sm leading-5"
              >
                {" "}
                Author
              </Link>{" "}
              and{" "}
              <Link
                href="javascript:;"
                className="2xl:text-base md:text-[15px] text-sm leading-5"
              >
                {" "}
                General Terms
              </Link>
              , as well as WebbyTemplate's{" "}
              <Link
                href="javascript:;"
                className="2xl:text-base md:text-[15px] text-sm leading-5"
              >
                {" "}
                Privacy Policy.
              </Link>
            </Checkbox>
          </div>
          {/* <Button className="btn btn-primary">Keep Going</Button> */}
          {/* MODAL START */}
          <Button className="btn btn-primary" onPress={onOpen}>
            Open Modal
          </Button>
          <Modal
            backdrop="opaque"
            classNames={{
              body: "py-6",
              backdrop: "bg-black/50 backdrop-opacity-40",
              base: "border-[#292f46] bg-white px-2",
              header: "border-b-[1px] border-primary/10 py-2 px-4",
              closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
            isOpen={isOpen}
            radius="lg"
            hideCloseButton="true"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex items-center justify-between w-full gap-1">
                    <h5>Become an Author</h5>
                    <Button
                      color="foreground"
                      variant="light"
                                          onPress={onClose}
                                          className="p-0 !min-w-[22px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="black"
                          fill-rule="evenodd"
                          d="M4.15 4.15a.5.5 0 0 1 .707 0l3.15 3.15l3.15-3.15a.5.5 0 0 1 .707.707l-3.15 3.15l3.15 3.15a.5.5 0 0 1-.707.707l-3.15-3.15l-3.15 3.15a.5.5 0 0 1-.707-.707l3.15-3.15l-3.15-3.15a.5.5 0 0 1 0-.707"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </Button>
                  </ModalHeader>
                  <ModalBody className="p-4">
                    <p>
                     Profile Updated Successfully !
                    </p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          {/* MODAL END */}
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/images/become-an-author.png"
            width="638"
            height="620"
            className="rounded-lg w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default page;
