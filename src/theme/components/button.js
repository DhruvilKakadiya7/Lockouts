const baseStyle = {
    borderRadius: 'lg',
    borderColor: 'transparent',
    boxShadow: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    _disabled: {
      cursor: 'not-allowed',
    },
    _hover: {
      _disabled: {
        bg: 'initial',
      },
    },
    _focus: {
      outline: 0,
    },
};

function variantPrimary() {
    const disabled = {
        bg: 'grey.300',
        color: 'grey.500',
    };
  
    const loading = {
        bg: 'primary.600',
        color: 'white',
    };
  
    return {
        bg: 'primary.500',
        color: 'white',
        _hover: {
            bg: 'primary.600',
            _disabled: {
                ...disabled,
                _loading: loading,
            },
        },
        _active: {
            bg: 'primary.700',
        },
        _disabled: {
            ...disabled,
            _loading: loading,
        },
    };
}
  
const variants = {
    primary: variantPrimary,
    // add more variants as needed
};

const sizes = {
    lg: {
      apply: 'textStyles.body3Semi',
      px: 6,
      minW: '12rem',
      h: '4.8rem',
    },
    md: {
      apply: 'textStyles.body3Semi',
      px: 5,
      minW: '12rem',
      h: '4rem',
    },
    sm: {
      apply: 'textStyles.body4Semi',
      px: 4,
      minW: '10rem',
      h: '3.2rem',
    },
};

const defaultProps = {
    variant: 'primary',
    size: 'md',
};

const Button = {
    baseStyle,
    variants,
    sizes,
    defaultProps,
};

export default Button;