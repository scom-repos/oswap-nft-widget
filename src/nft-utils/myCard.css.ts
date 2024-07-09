import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const myCardStyle = Styles.style({
  $nest: {
    '.bg-flip': {
      backgroundColor: 'transparent',
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      overflow: 'visible',
    },
    '.btn-burn': {
      width: '100%',
      height: '50px',
      border: 'none',
      padding: '0.375rem 0.5rem',
      background: Theme.background.gradient, //oswap theme
      color: Theme.text.primary,
    },
    '.card-section': {
      borderRadius: '12px',
      backgroundColor: 'transparent',
      $nest: {
        '&.active .bg-flip': {
          transform: 'rotateY(180deg)',
          $nest: {
            '.mycard-img': {
              pointerEvents: 'none'
            },
            '.section-my-card': {
              zIndex: 1
            }
          }
        }
      }
    },
    '.section-my-card': {
      padding: '0.5rem 0.75rem',
      backgroundColor: '#ffffff33',
      color: Theme.text.primary,
      transform: 'rotateY(180deg)',
      position: 'absolute',
      borderRadius: '12px',
      top: 0,
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'start',
      gap: '0.75rem'
    },
    '.mycard-img img': {
      minHeight: 280
    },
    '.mycard-img, .section-my-card': {
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      transform: 'rotateX(0deg)'
    },
    '.row-item': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '2px 0',
      textAlign: 'left',
      $nest: {
        '.title-icon': {
          position: 'relative',
        },

        '.title-icon i-icon': {
          position: 'absolute',
          top: '50%',
          right: '-20px',
          transform: 'translateY(-50%)',
          display: 'inline-block',
          width: '14px',
          height: '14px',
        },

        '.value': {
          fontWeight: 700,
        },
      },
    },
  },
})
