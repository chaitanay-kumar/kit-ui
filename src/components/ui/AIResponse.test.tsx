import {render,screen,cleanup} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {AIResponse} from './AIResponse';

afterEach(cleanup);
it('consumes unsupported heading markers without hanging or losing subsequent content',()=>{
 render(<AIResponse content={'#### literal heading\n#not a heading\n\n# Valid heading\n\nFollowing text'}/>);
 expect(screen.getByText('#### literal heading')).toBeInTheDocument();
 expect(screen.getByText('#not a heading')).toBeInTheDocument();
 expect(screen.getByRole('heading',{name:'Valid heading',level:2})).toBeInTheDocument();
 expect(screen.getByText('Following text')).toBeInTheDocument();
});
