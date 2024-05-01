import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/webpack-resolver';

ace.edit('editor', {
    mode: 'ace/mode/javascript',
    theme: 'ace/theme/monokai'
});
