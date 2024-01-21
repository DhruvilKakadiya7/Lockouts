import React, { useEffect, useRef } from 'react'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-c_cpp.js";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-d";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-ocaml";
import "ace-builds/src-noconflict/mode-pascal";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-scheme";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-erlang";
import "ace-builds/src-noconflict/mode-elixir";

import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { useColorModeValue } from '@chakra-ui/react';
import languages, { codes_to_languages } from './languages';

const Editor = ({
    languageCode,
    onSetCode,
    providedValue,
    readOnly,
}) => {
    const theme = useColorModeValue("iplastic", "monokai");
    const selection = languageCode ?
        languages['CF'][codes_to_languages['CF'][languageCode]]
        : languages['CF'][languages.defaults['CF']];
    const editorRef = useRef();
    function onChange(newValue) {
        onSetCode(newValue);
    }
    
    useEffect(() => {
        if (providedValue && editorRef.current) {
            editorRef.current.setValue(providedValue);
        }
    }, [providedValue]);    
    return (
        <AceEditor
            onLoad={(editor) => {
                editorRef.current = editor.session;
            }}
            mode={selection}
            theme={theme}
            onChange={readOnly === true ? () => {} : onChange}
            name='editor'
            width='100%'
            height='400px'
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                enableEmmet: false,
            }}
        />
    );
}

export default Editor;