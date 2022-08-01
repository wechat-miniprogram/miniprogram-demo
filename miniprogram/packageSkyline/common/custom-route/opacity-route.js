import { IRouteContext, Curves } from './common';

const OpacityTransitionRouteBuilder = ({ primaryAnimation }) => {
  const handlePrimaryAnimation = () => {
    'worklet';
    return {
      opacity: Curves.fastOutSlowIn(primaryAnimation.value),
    };
  };

  return {
    handlePrimaryAnimation,
    transitionDuration: 1000,
    reverseTransitionDuration: 1000,
    canTransitionTo: true,
    canTransitionFrom: false,
  };
};

export default OpacityTransitionRouteBuilder;
