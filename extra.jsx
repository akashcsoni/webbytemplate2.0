"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const SinglePageModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <>
        <Button
          onPress={onOpen}
          color="primary"
          className="w-full btn btn-primary flex items-center justify-center"
        >
          Contact Sales
        </Button>

        <Modal
            isOpen={isOpen}
            hideCloseButton={true}
            onClose={onClose}
            backdrop="blur"
          //   size={"5xl"}
            classNames={{ base: "p-4 md:p-8 ", }}
            //   placement="center"
            scrollBehavior="inside"
        >
          <ModalContent className="p-[30px]">
            {(onClose) => (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <div className="w-6 h-6">X</div>
                </button>

                <ModalBody className="p-[30px]">
                  <div className="grid md:grid-cols-2 gap-10 w-full">
                    {/* Left - Form */}
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Contact Sales
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Seamless shopping starts with a simple login.
                      </p>

                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Company email
                          </label>
                          <input
                            type="email"
                            placeholder="Email address"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            How can we help?
                          </label>
                          <textarea
                            placeholder="Let's talk now..."
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <p className="text-xs text-gray-500">
                          By clicking "Talk to WebbyTemplate", I acknowledge
                          that I have read and understood the{" "}
                          <span className="text-blue-600 underline cursor-pointer">
                            Privacy Notice.
                          </span>
                        </p>

                        <Button
                          color="primary"
                          className="bg-blue-600 text-white"
                        >
                          Talk to WebbyTemplate
                        </Button>
                      </form>
                    </div>

                    {/* Right - Info */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        Let’s Create a Pricing for Your Unique Requirements
                      </h3>
                      <p className="text-sm text-gray-600">
                        Developing the right pricing strategy involves balancing
                        profitability, customer value. By analyzing your market,
                        costs, and competitive landscape, you can choose an
                        approach.
                      </p>

                      <div className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          📞
                        </span>
                        <div>
                          <h4 className="font-medium">
                            Experience WebbyTemplate in Action
                          </h4>
                          <p className="text-sm text-gray-600">
                            Request a personalized demo and see how
                            WebbyTemplate can transform your enterprise with
                            tailored plans and pricing.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          ✅
                        </span>
                        <div>
                          <h4 className="font-medium">
                            Try WebbyTemplate Enterprise Free
                          </h4>
                          <p className="text-sm text-gray-600">
                            Get hands-on with WebbyTemplate Enterprise—boost
                            your workflow and impact with a free trial today!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default SinglePageModal;
