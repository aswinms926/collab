'use client';

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

export default function EditorPlaceholder() {
    return (
        <div className="h-full w-full flex items-center justify-center p-6 bg-default-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <Card className="max-w-md w-full border-none bg-transparent shadow-none" radius="lg">
                    <CardBody className="py-12 items-center text-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary/10 to-secondary/10 text-primary shadow-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-10 h-10"
                            >
                                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </motion.div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl font-bold text-foreground/80 tracking-tight">
                                Ready to Write?
                            </h3>
                            <p className="text-default-500 max-w-xs mx-auto text-base leading-relaxed">
                                Select a note from the sidebar or click <span className="text-primary font-medium">New Note</span> to start capturing your ideas.
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
