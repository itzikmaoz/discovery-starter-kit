import React from 'react';
import ReactDOM from 'react-dom';
import PassagesContainer from '../../../containers/PassagesContainer/PassagesContainer';
import PassageComparison from '../../../containers/PassagesContainer/PassageComparison';
import { shallow } from 'enzyme';

describe('<PassagesContainer />', () => {
  const enriched_results = {
    matching_results: 3,
    results: [
      {
        id: '1',
        text: 'a great answer with a great passage',
      },
      {
        id: '2',
        text: 'a great answer 2 with a great passage 2',
      },
      {
        id: '3',
        text: 'a great answer 3 with a great passage 3',
      }
    ],
    passages: [
      {
        document_id: '1',
        passage_text: 'a great passage'
      },
      {
        document_id: '2',
        passage_text: 'a great passage 2'
      },
      {
        document_id: '3',
        passage_text: 'a great passage 3'
      }
    ]
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <PassagesContainer
        enriched_results={enriched_results}
      />, div);
  });

  it('has 3 <PassageComparison /> in it', () => {
    const wrapper = shallow(<PassagesContainer
                              enriched_results={enriched_results}
                            />);
    expect(wrapper.find(PassageComparison)).toHaveLength(3);
  });

  describe('when getNextDocumentWithPassages is called', () => {
    let wrapper;
    const documentIdsWithPassages = ['1', '2', '3'];

    beforeEach(() => {
      wrapper = shallow(<PassagesContainer
                          enriched_results={enriched_results}
                        />);
    });

    describe('and there are no documents shown', () => {
      const documentIndicesShown = [];

      it('returns the first document with passages', () => {
        expect(wrapper.instance().getNextDocumentWithPassages(
                                    documentIndicesShown,
                                    documentIdsWithPassages))
          .toEqual(enriched_results.results[0])
      });
    });

    describe('and the first document is shown', () => {
      const documentIndicesShown = [0];

      it('returns the second document with passages', () => {
        expect(wrapper.instance().getNextDocumentWithPassages(
                                    documentIndicesShown,
                                    documentIdsWithPassages))
          .toEqual(enriched_results.results[1])
      });
    });
  });

  describe('when getPassagesFromDocument is called', () => {
    let wrapper;
    let passageIndicesShown;
    let documentId;

    describe('and there are multiple passages in the same document', () => {
      const multiple_passages_results = Object.assign({}, enriched_results, {
        passages: [
          {
            document_id: '1',
            passage_text: 'a great answer'
          },
          {
            document_id: '1',
            passage_text: 'a great passage'
          },
          {
            document_id: '2',
            passage_text: 'a great passage 2'
          }
        ]
      });

      beforeEach(() => {
        wrapper = shallow(<PassagesContainer
                            enriched_results={multiple_passages_results}
                          />);
        passageIndicesShown = [];
        documentId = '1';
      });

      it('should return both passages with indices added', () => {
        const actual = wrapper.instance().getPassagesFromDocument(
          documentId,
          passageIndicesShown
        );
        expect(actual[0]).toEqual({
          document_id: '1',
          passage_text: 'a great answer',
          index: 0
        });
        expect(actual[1]).toEqual({
          document_id: '1',
          passage_text: 'a great passage',
          index: 1
        });
        expect(passageIndicesShown).toEqual([0, 1]);
      });

      describe('and there are already passages shown', () => {
        beforeEach(() => {
          passageIndicesShown = [0, 1];
          documentId = '2';
        });

        it('should return the next passage with index added', () => {
          const actual = wrapper.instance().getPassagesFromDocument(
            documentId,
            passageIndicesShown
          );
          expect(actual[0]).toEqual({
            document_id: '2',
            passage_text: 'a great passage 2',
            index: 2
          });
          expect(passageIndicesShown).toEqual([0, 1, 2]);
        });
      });
    });
  });

  describe('when enriched_results has 0 results', () => {
    let wrapper;

    beforeEach(() => {
      const no_results_passages = {
        matching_results: 0,
        results: [],
        passages: []
      }
      wrapper = shallow(<PassagesContainer
                          enriched_results={no_results_passages}
                        />);
    });

    it('shows "No Results"', () => {
      expect(wrapper.find(PassageComparison)).toHaveLength(0);
      expect(wrapper.find('h2').text()).toEqual('No Results');
    });
  });

  describe('when more results exist than currently shown', () => {
    let wrapper;

    beforeEach(() => {
      const more_than_three_results = {
        matching_results: 4,
        results: [
          {
            id: '1',
            text: 'a great answer with a great passage',
          },
          {
            id: '2',
            text: 'a great answer 2 with a great passage 2',
          },
          {
            id: '3',
            text: 'a great answer 3 with a great passage 3',
          },
          {
            id: '4',
            text: 'a great answer 4 with a great passage 4',
          }
        ],
        passages: [
          {
            document_id: '1',
            passage_text: 'a great passage'
          },
          {
            document_id: '2',
            passage_text: 'a great passage 2'
          },
          {
            document_id: '3',
            passage_text: 'a great passage 3'
          },
          {
            document_id: '4',
            passage_text: 'a great passage 4'
          }
        ]
      };
      wrapper = shallow(<PassagesContainer
                          enriched_results={more_than_three_results}
                        />);
    });

    it('shows a "Show more results" button', () => {
      expect(wrapper.find('.show_results--div button').text())
        .toEqual('Show more results');
    });

    describe('when the "Show more results" button is clicked', () => {
      beforeEach(() => {
        wrapper.find('.show_results--div button').simulate('click');
      });

      it('increments the total_results_shown', () => {
        expect(wrapper.instance().state.total_results_shown).toEqual(4);
      });

      it('shows more results', () => {
        expect(wrapper.find(PassageComparison)).toHaveLength(4);
      });

      it('does not show the "Show more results" button anymore', () => {
        expect(wrapper.find('.show_results--div button')).toHaveLength(0);
      });
    });
  });
});
