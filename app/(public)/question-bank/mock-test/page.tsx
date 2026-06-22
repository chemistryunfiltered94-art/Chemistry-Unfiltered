import { getQuestions } from "@/lib/firestore";
import MockTestClient from "@/components/question-bank/MockTestClient";

export const metadata = {
  title: "Mock Test — মক টেস্ট",
  description: "সময়সীমা সহ রসায়ন মক টেস্ট দাও এবং নিজের প্রস্তুতি যাচাই করো।",
};

export default async function MockTestPage() {
  const mcqs = await getQuestions();
  return <MockTestClient mcqs={mcqs} />;
}
