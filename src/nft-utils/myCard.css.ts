import { Styles } from '@ijstech/components'

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
    '.invisible': {
      opacity: '0 !important'
    },
    '.text-yellow *': {
      color: '#f7d063',
    },
    'i-icon': {
      display: 'inline-block',
    },
    '.btn-burn': {
      width: '100%',
      height: '50px',
      border: 'none',
      padding: '0.375rem 0.5rem',
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
      color: 'white',
      transform: 'rotateY(180deg)',
      position: 'absolute',
      borderRadius: '12px',
      top: 0,
      flexDirection: 'column',
      flexWrap: 'nowrap',
      display: 'flex',
      justifyContent: 'space-between'
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
      $nest: {
        '.title-icon': {
          position: 'relative',
        },

        'i-label': {
          $nest: {
            '*': {
              fontSize: '0.75rem',
            },
          },
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
