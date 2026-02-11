import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from '@/Card';

interface AccordionItemProps {
    title: string;
    content: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    content,
    isOpen,
    onToggle,
    className = '',
}) => {
    return (
        <Card hover={false} className={`overflow-hidden ${className}`}>
            <button
                onClick={onToggle}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-slate-900 dark:text-white pr-4 text-lg">
                    {title}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 transition-transform duration-300" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 transition-transform duration-300" />
                )}
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                    {content}
                </div>
            </div>
        </Card>
    );
};

interface AccordionProps {
    items: {
        title: string;
        content: React.ReactNode;
    }[];
    allowMultiple?: boolean;
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    className = '',
}) => {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const handleToggle = (index: number) => {
        if (allowMultiple) {
            setOpenIndexes((prev) =>
                prev.includes(index)
                    ? prev.filter((i) => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {items.map((item, index) => (
                <AccordionItem
                    key={item.title}
                    title={item.title}
                    content={item.content}
                    isOpen={openIndexes.includes(index)}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

export default Accordion;
