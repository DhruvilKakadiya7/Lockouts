import * as React from "react";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Text, Box, Center } from "@chakra-ui/react";
import { useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const InlineEquation = (props) => {
  return (
    <InlineMath  {...props} />
  )
};

const BlockEquation = (props) => {
  return (
    <BlockMath  {...props} />
  )
};

const BlockCode = ({ children, className }) => {
  const language = className ? className.replace('language-', '') : 'cpp';

  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus}>
      {children?.props?.children}
    </SyntaxHighlighter>
  );
};

const BreakLiner = () => {
  return (
    <br></br>
  )
};

const options = {
  overrides: {
    math: {
      component: BlockEquation,
    },
    inlineMath: {
      component: InlineEquation,
    },
    h1: {
      component: Center,
      props: { fontSize: '2rem', fontWeight: '800' }
    },
    h2: {
      component: Box,
      props: { fontSize: '1.3rem', fontWeight: '600', my: '1' }
    },
    p: {
      component: Box,
      props: { fontSize: '1.2rem', as: 'div' }
    },
    li: {
      component: Box,
      props: { fontSize: '1.2rem', as: 'li' }
    },
    br: {
      component: BreakLiner,
    },
  },
};

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
    ],
    displayMath: [
      ["$$", "$$"],
    ],
    math: [
      ["$$", "$$"],
    ]
  }
};

export default function Problem({ problem, mathJaxRendered, onMathJaxRendered, idx }) {
  let problemStatement = problem?.content.problemStatement;
  problemStatement = problemStatement?.replace(/\$\$\(/g, '$$');
  problemStatement = problemStatement?.replace(/\$\(/g, '$');
  problemStatement = problemStatement?.replace(/\)\$/g, '$');
  problemStatement = problemStatement?.replace(/\)\$\$/g, '$$');

  let problemInput = problem?.content.problemInput;
  problemInput = problemInput?.replace(/\$\$\(/g, '$$');
  problemInput = problemInput?.replace(/\$\(/g, '$');
  problemInput = problemInput?.replace(/\)\$/g, '$');
  problemInput = problemInput?.replace(/\)\$\$/g, '$$');

  let problemOutput = problem?.content.problemOutput;
  problemOutput = problemOutput?.replace(/\$\$\(/g, '$$');
  problemOutput = problemOutput?.replace(/\$\(/g, '$');
  problemOutput = problemOutput?.replace(/\)\$/g, '$');
  problemOutput = problemOutput?.replace(/\)\$\$/g, '$$');

  let problemNote = problem?.content.problemNote;
  problemNote = problemNote?.replace(/\$\$\(/g, '$$');
  problemNote = problemNote?.replace(/\$\(/g, '$');
  problemNote = problemNote?.replace(/\)\$/g, '$');
  problemNote = problemNote?.replace(/\)\$\$/g, '$$');

  let problemTestCase = problem?.content.problemTestCases;
  // console.log(xx);
  useEffect(() => {
    if (!mathJaxRendered && document.querySelector(".MathJaxEnd")) {
      onMathJaxRendered();
    }
  }, [mathJaxRendered]);

  return (
    <MathJaxContext config={config}>
      <MathJax>
        <Center fontSize={'2rem'} fontWeight={700}>
          {`${String.fromCharCode(65 + idx)}. ${problem?.name}`}
        </Center>
        <Center fontWeight={550}>
          <div
            dangerouslySetInnerHTML={{
              __html: problem?.content.problemTimeLimit.replace('time limit per test', 'time limit per test: ')
            }}
          >
          </div>
        </Center>
        <Center fontWeight={550}>
          <div
            dangerouslySetInnerHTML={{
              __html: problem?.content.problemMemoryLimit.replace('memory limit per test', 'memory limit per test: ')
            }}
          >
          </div>
        </Center>
        <div
          className="MathJaxEnd"
          style={{marginTop: '1em'}}
          dangerouslySetInnerHTML={{
            __html: problemStatement
          }}
        >
        </div>
        <Text fontWeight={700} fontSize={'1.3rem'} marginTop={1}>
          Input
        </Text>
        <div
          className="MathJaxEnd"
          dangerouslySetInnerHTML={{
            __html: problemInput
          }}
        >
        </div>
        <Text fontWeight={700} fontSize={'1.3rem'} marginTop={1}>
          Output
        </Text>
        <div
          className="MathJaxEnd"
          dangerouslySetInnerHTML={{
            __html: problemOutput
          }}
        >
        </div>
        <div
          className="MathJaxEnd"
          dangerouslySetInnerHTML={{
            __html: problemTestCase
          }}
        >
        </div>
        <div
          className="MathJaxEnd"
          dangerouslySetInnerHTML={{
            __html: problemNote
          }}
        >
        </div>
      </MathJax>
    </MathJaxContext>
  );
}