import React from 'react';
import ReactDOM from 'react-dom';
import PassageComparison from '../../../containers/PassagesContainer/PassageComparison';
import ResultContainer from '../../../containers/ResultContainer/ResultContainer';
import { shallow } from 'enzyme';

describe('<PassageComparison />', () => {
  let wrapper;
  const props = {
    passages: [
      {
        document_id: '1',
        passage_text: 'a passage',
        index: 0
      },
      {
        document_id: '1',
        passage_text: 'another passage',
        index: 1
      }
    ],
    passageFullResult: {
      id: '1',
      text: 'a good answer with a passage and another passage'
    },
    index: 0
  }

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PassageComparison {...props} />, div);
  });

  it('has 2 <ResultContainer /> with expected text containing highlighted passages', () => {
    wrapper = shallow(<PassageComparison {...props} />);

    const resultBoxes = wrapper.find(ResultContainer);
    const expectedAnswer = props.passageFullResult.text;
    const expectedPassage = [
      'a good answer with ',
      (
        <span className='passage--span' key={'passage_1'}>
          <span className='passage_rank--span' />
          <b>
            { 'a passage' }
          </b>
        </span>
      ),
      ' and ',
      (
        <span className='passage--span' key={'passage_2'}>
          <span className='passage_rank--span' />
          <b>
            { 'another passage' }
          </b>
        </span>
      )
    ];
    expect(resultBoxes).toHaveLength(2);
    expect(resultBoxes.at(0).props().result_text).toEqual(expectedAnswer);
    expect(resultBoxes.at(1).props().result_text).toEqual(expectedPassage);
  });

  it('has 2 titles', () => {
    wrapper = shallow(<PassageComparison {...props} />);

    const titles = wrapper.find('.passages_comparison_content--div h5');

    expect(titles).toHaveLength(2);
    expect(titles.at(0).text()).toEqual('Standard search');
    expect(titles.at(1).text()).toEqual('Passage search');
  });

  describe('when index is not 0', () => {
    beforeEach(() => {
      const props_with_nonzero_index = Object.assign({}, props, {
        index: 1
      });

      wrapper = shallow(<PassageComparison {...props_with_nonzero_index} />);
    });

    it('does not show titles', () => {
      const titles = wrapper.find('.passages_comparison_header--div h4');

      expect(titles).toHaveLength(0);
      expect(wrapper.text()).not.toContain('Standard Search');
      expect(wrapper.text()).not.toContain('Passage Search');
    });
  });

  describe('when calling highlightPassages', () => {
    describe('and there is only one passage at the beginning', () => {
      beforeEach(() => {
        const props_with_begin_passage = Object.assign({}, props, {
          passages: [
            {
              passage_text: 'beginning passage',
              index: 0
            }
          ],
          passageFullResult: {
            text: 'beginning passage with other stuff'
          }
        })
        wrapper = shallow(<PassageComparison {...props_with_begin_passage} />);
      });

      it('returns expected html', () => {
        const expectedHtml = [
          (
            <span className='passage--span' key={'passage_1'}>
              <span className='passage_rank--span' />
              <b>
                { 'beginning passage' }
              </b>
            </span>
          ),
          ' with other stuff'
        ];
        const actual = wrapper.instance().highlightPassages();
        expect(actual).toEqual(expectedHtml);
      });
    });

    describe('and there is only one passage at the end', () => {
      beforeEach(() => {
        const props_with_end_passage = Object.assign({}, props, {
          passages: [
            {
              passage_text: 'ending passage',
              index: 0
            }
          ],
          passageFullResult: {
            text: 'some stuff before ending passage'
          }
        })
        wrapper = shallow(<PassageComparison {...props_with_end_passage} />);
      });

      it('returns expected html', () => {
        const expectedHtml = [
          'some stuff before ',
          (
            <span className='passage--span' key={'passage_1'}>
              <span className='passage_rank--span' />
              <b>
                { 'ending passage' }
              </b>
            </span>
          )
        ];
        const actual = wrapper.instance().highlightPassages();
        expect(actual).toEqual(expectedHtml);
      });
    });
  });

  describe('when calling replaceNewlines', () => {
    it('returns expected html', () => {
      const expected = [
        (
          <span key={'newline_0'}>
            {'text'}
            <br />
          </span>
        ),
        (
          <span key={'newline_1'}>
            {'newline'}
            { false }
          </span>
        )
      ];
      const actual = wrapper.instance().replaceNewlines('text\nnewline');

      expect(actual).toEqual(expected);
    });
  });
});
