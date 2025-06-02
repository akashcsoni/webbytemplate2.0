"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  Badge,
} from "@heroui/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormMultiSelect({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const [localError, setLocalError] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(defaultValueData || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedKeys(defaultValueData || []);
  }, [defaultValueData]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return data.options.filter((dataList) =>
      dataList.slug
        .toLowerCase()
        .includes(searchQuery.replace(" ", "-").toLowerCase())
    );
  }, [data.options, searchQuery]);

  const selectedValue = useMemo(() => {
    const selectedTitles = data.options
      .filter((item) => selectedKeys.includes(item?.documentId))
      .map((item) => item.title);

    return selectedTitles.length > 0
      ? selectedTitles.join(", ")
      : "Select member";
  }, [selectedKeys, data.options]);

  const handleChange = () => {
    onChange(data.name, selectedKeys);
  };

  useEffect(() => {
    handleChange();
  }, [selectedKeys]);

  useEffect(() => {
    setLocalError(error && error.length > 0 ? error[0] : "");
  }, [error]);

  const isInvalid = localError && localError.length > 0;
  const errorMessage = localError;

  const handleSelect = (value) => {
    setSelectedKeys((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const clearAll = () => {
    setSelectedKeys([]);
  };

  const selectedOptions = data.options.filter((option) =>
    selectedKeys.includes(option?.documentId)
  );

  return (
    <div className="w-full">
      <p className="2xl:!text-base md:!text-[15px] !text-black !text-md pb-2">
        {data.label}
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`!scale-100 block w-full justify-between rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal  ${selectedKeys.length === 0 ? "text-default-400" : "text-black"}  border-gray-100 hover:border-default-400 focus:border-default-foreground text-base border outline-none flex ${isInvalid ? " !border-danger" : ""}`}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedKeys.length === 0 ? (
                <span>Select member</span>
              ) : (
                selectedOptions.map((option, index) => (
                  <div
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span className="font-normal">{option.title},</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-3 ml-2">
              {selectedKeys.length > 0 && (
                <X
                  className="w-4 h-4 text-gray-500 hover:bg-gray-200 rounded cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                />
              )}
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((option) => (
                  <CommandItem
                    key={option?.documentId}
                    value={option?.documentId}
                    onSelect={() => handleSelect(option?.documentId)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "w-4 h-4",
                        selectedKeys.includes(option?.documentId)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.cover && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={option.cover.url || "/placeholder.svg"}
                          alt={option.cover.name}
                        />
                        <AvatarFallback className="text-xs">
                          {option.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm">{option.title}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
