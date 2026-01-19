import { useState } from "react";
import { useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import {
    HelpCircle,
    Tag,
    Trash2,
    Database,
    History,
    ChevronDown,
    FileText,
    AlertCircle,
    Download,
    List,
    Globe,
    PlusCircle,
    RotateCcw,
    Clock,
} from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { HomeIcon } from "@shopify/polaris-icons";
import { Icon, Page } from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
    return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

interface FaqItemProps {
    question: string;
    answer: React.ReactNode;
    icon?: React.ElementType;
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem = ({ question, answer, icon: Icon, isOpen, onClick }: FaqItemProps) => {
    return (
        <div
            className={`bg-white rounded-lg border transition-all duration-300 overflow-hidden ${isOpen
                ? 'border-black shadow-md ring-1 ring-black/5'
                : 'border-[#e0e2e4] hover:border-black/30 hover:shadow-sm'
                }`}
        >
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-3 text-left bg-white transition-colors cursor-pointer group"
            >
                <div className="flex items-center gap-4">
                    {Icon && (
                        <div className={`p-2 rounded-md border shrink-0 transition-all ${isOpen
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-gray-50 border-gray-100 text-gray-500 group-hover:text-black group-hover:border-gray-200'
                            }`}>
                            <Icon size={16} strokeWidth={2} />
                        </div>
                    )}
                    <span className={`font-semibold text-[14px] transition-colors ${isOpen ? 'text-black' : 'text-[#202223] group-hover:text-black'
                        }`}>
                        {question}
                    </span>
                </div>
                <div className={`ml-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : 'group-hover:text-gray-600'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-4 pb-4 pt-0 text-sm text-gray-600 leading-relaxed">
                    <div className="pt-4 border-t border-gray-100">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const navigate = useNavigate();

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Tag Metafield Manager?",
            icon: HelpCircle,
            answer: (
                <div className="space-y-3">
                    <p>
                        <strong>Tag Metafield Manager</strong> helps you easily{" "}
                        <strong>add, remove, update, and manage tags and metafields</strong>{" "}
                        across your Shopify store in bulk.
                    </p>
                    <p className="text-sm text-gray-600">
                        It is designed for large stores and uses CSV-based processing with
                        safe execution, operation history, and undo support.
                    </p>
                </div>
            ),
        },
        {
            question: "How does tag addition work?",
            icon: Tag,
            answer: (
                <div className="space-y-4">
                    <p>
                        The <strong>Add Tags</strong> section allows you to apply tags to many
                        resources at once using a CSV file.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700">
                            <li>Enter the tag(s) you want to add</li>
                            <li>Upload a CSV file</li>
                            <li>Run the process and download the result file</li>
                        </ol>
                    </div>

                </div>
            ),
        },
        {
            question: "How does tag removal work?",
            icon: Trash2,
            answer: (
                <div className="space-y-4">
                    <p>
                        The <strong>Remove Tags</strong> section gives you two easy ways to
                        clean up unwanted tags.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border border-gray-200 p-4 rounded-lg bg-white hover:border-blue-200 transition-colors">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Remove via CSV
                            </h4>
                            <p className="text-sm text-gray-500">
                                Upload a CSV file to remove tags only from selected resources.
                            </p>
                        </div>

                        <div className="border border-gray-200 p-4 rounded-lg bg-white hover:border-red-200 transition-colors">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-red-600" />
                                Global Remove
                            </h4>
                            <p className="text-sm text-gray-500">
                                Remove selected tags from all resources where they exist no CSV required.
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            question: "What is the Metafield Manager?",
            icon: Database,
            answer: (
                <div className="space-y-3">
                    <p>
                        The <strong>Metafield Manager</strong> lets you manage metafields in bulk
                        for any Shopify resource that supports metafields.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700">
                            <li>Select a resource type</li>
                            <li>View all existing metafields</li>
                            <li>Update or remove metafield values</li>
                        </ol>
                    </div>
                </div>
            ),
        },
        {
            question: "How are list-type metafields handled?",
            icon: List,
            answer: (
                <div className="space-y-3">
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2.5">
                            <Globe className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <span><strong>Remove Globally:</strong> Remove values from all resources</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <span><strong>Remove Specific:</strong> Remove values using CSV</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <PlusCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <span><strong>Add / Update:</strong> Append or update values via CSV</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 italic">
                        CSV files include resource identifiers and metafield values.
                    </p>
                </div>
            ),
        },
        {
            question: "What is the CSV upload limit?",
            icon: AlertCircle,
            answer: (
                <div className="space-y-3">
                    <p>
                        Each CSV file can contain up to <strong>5,000 records</strong>.
                    </p>
                    <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg border border-orange-100 text-sm">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <p className="text-orange-900">
                            For larger data, split your records into multiple CSV files to ensure smooth processing.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            question: "Can I export resource data and GIDs?",
            icon: Download,
            answer: (
                <div className="space-y-2">
                    <p>
                        Yes. You can export Shopify resource data and GIDs directly from the app.
                    </p>
                    <p className="text-sm text-gray-500">
                        This helps you prepare CSV files quickly without manual API work.
                    </p>
                </div>
            ),
        },
        {
            question: "Can I view and undo past operations?",
            icon: History,
            answer: (
                <div className="space-y-3">
                    <p>
                        All actions are recorded in the <strong>History</strong> section.
                    </p>
                    <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>Undo available for <strong>2 days</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-blue-600" />
                            <span>Each operation can be undone <strong>once</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span>History is auto-deleted after 2 days</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            question: "Which identifiers can I use in the CSV file?",
            icon: FileText,
            answer: (
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                        Supported CSV Identifiers
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            <strong>Default:</strong> Shopify Resource GID
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            <strong>Products:</strong> SKU or Handle
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            <strong>Customers:</strong> Email
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            <strong>Orders:</strong> Order Name (e.g. #1001)
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            <strong>Blog Posts:</strong> Handle
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            question: "Do I need to keep the app open during operations?",
            icon: AlertCircle,
            answer: (
                <div className="flex gap-3 bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold text-gray-900 text-sm mb-1">Keep tab open</p>
                        <p className="text-sm text-gray-600">
                            Please keep the app open until progress reaches <strong>100%</strong>.
                            Bulk operations run in batches due to Shopify API limits.
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Page>
            <div className="flex flex-col space-y-0.5 mb-3 rounded-sm">
                {/* Header Row */}
                <div className="flex items-center space-x-2">
                    {/* Home Icon Button - Aligned just before the title */}
                    <button
                        onClick={() => navigate("/app")}
                        className="flex cursor-pointer items-center justify-center text-[#303030] hover:opacity-70 transition-opacity focus:outline-none"
                        aria-label="Go to Home"
                    >
                        <Icon source={HomeIcon} />
                    </button>

                    <div className="text-xl font-bold leading-tight">
                        Frequently Asked Questions
                    </div>
                </div>

                <p className="text-[15px] text-gray-500 leading-relaxed ml-12">
                    Everything you need to know about managing your store's data with{" "}
                    <span className="font-semibold text-black">Tag MetaField Manager</span>.
                </p>
            </div>

            <div className="space-y-4" >
                {faqs.map((faq, index) => (
                    <div key={index} className="transition-all duration-200 hover:translate-y-[-1px]">
                        <FaqItem
                            question={faq.question}
                            answer={faq.answer}
                            icon={faq.icon}
                            isOpen={openIndex === index}
                            onClick={() => toggleFaq(index)}
                        />
                    </div>
                ))}
            </div>
        </Page>
    );
}
