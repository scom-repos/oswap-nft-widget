import {
  Container,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Button,
  IEventBus,
  application
} from '@ijstech/components'
import { BigNumber } from '@ijstech/eth-wallet';
import Assets from '../assets';
import { EventId } from '../global/index';
import { isWalletConnected, State } from '../store/index';
import { cardStyle } from './card.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-card']: ControlElement
    }
  }
}

@customElements('nft-card')
export class NftCard extends Module {
  private $eventBus: IEventBus;
  private _cardData: any;
  private pnlSlots: Panel;
  private stakeAmountText: Label;
  private trollImage: Panel;
  private reward: Label;
  private monthlyReward: Label;
  private flashSales: Label;
  private btnHandleStake: Button;
  private _onStake: any;
  private clientEvents: any[] = [];
  private state: State;

  constructor(state: State, parent?: Container, options?: any) {
    super(parent, options);
    this.state = state;
    this.$eventBus = application.EventBus;
    this.registerEvent();
  }

  onHide() {
    for (let event of this.clientEvents) {
      event.unregister();
    }
    this.clientEvents = [];
  }

  get onStake() {
    return this._onStake;
  }

  set onStake(callback: any) {
    this._onStake = callback;
  }

  get cardData(): any {
    return this._cardData;
  }

  set cardData(value: any) {
    this._cardData = value;
    this.pnlSlots.clearInnerHTML();
    this.pnlSlots.append(<i-label caption="Available Slots" class="label"></i-label>);
    let slotText: string = new BigNumber(value.slot).lt(10) ? ('0' + value.slot) : value.slot;
    let slotArr = slotText.split('');
    for (let text of slotArr) {
      this.pnlSlots.append(<i-label caption={text} class="box box-left"></i-label>);
    }
    if (this.stakeAmountText) this.stakeAmountText.caption = value.stakeAmountText;
    if (this.reward) this.reward.caption = value.rewardsBoost;
    if (this.monthlyReward) this.monthlyReward.caption = value.monthlyReward;
    if (this.flashSales) this.flashSales.caption = value.flashSales;

    function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (this.trollImage) {
      const img1 = new Image();
      const img2 = new Image();
      const img3 = new Image();
      const img4 = new Image();
      const img5 = new Image();
      const trollText = new Label();
      const trollType = capitalizeFirstLetter(value.tier);
      img1.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Skin.svg`);
      img2.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Horn.svg`);
      img3.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Mouth.svg`);
      img4.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Shirt.svg`);
      img5.url = Assets.fullPath(`img/nft/${trollType}-Troll-01-Eyes.svg`);
      this.trollImage.appendChild(img1);
      this.trollImage.appendChild(img2);
      this.trollImage.appendChild(img3);
      this.trollImage.appendChild(img4);
      this.trollImage.appendChild(img5);
      this.trollImage.appendChild(trollText);
      trollText.caption = `${trollType} BABY TROLL`;
    }

    this.updateBtn();
  }

  updateBtn() {
    if (!isWalletConnected()) {
      this.btnHandleStake.caption = 'No Wallet';
      this.btnHandleStake.enabled = false;
    } else {
      const isSoldedOut = this.cardData?.slot == 0;
      this.btnHandleStake.caption = isSoldedOut ? 'Sold Out' : 'Stake';
      this.btnHandleStake.enabled = !isSoldedOut;
    }
  }

  registerEvent() {
    this.clientEvents.push(this.$eventBus.register(this, EventId.IsWalletConnected, this.updateBtn));
    this.clientEvents.push(this.$eventBus.register(this, EventId.IsWalletDisconnected, this.updateBtn));
  }

  handleStake() {
    this.onStake();
  }

  openLink() {
    const chainId = this.state.getChainId();
    this.state.viewOnExplorerByAddress(chainId, this._cardData.address);
  }

  async init() {
    this.classList.add(cardStyle);
    super.init();
  }

  render() {
    return (
      <i-panel class="card-widget">
        <i-panel class="bg-img">
          <i-panel id="pnlSlots" class="available-box">
            <i-label caption="Available Slots" class="label"></i-label>
            <i-label id="caption1" caption="0" class="box box-left"></i-label>
            <i-label id="caption2" caption="0" class="box box-right"></i-label>
          </i-panel>

          <i-panel id="trollImage" class="troll-img">
            <i-image
              url={Assets.fullPath('img/nft/Background.svg')}
              class="background"
            ></i-image>
            <i-image
              url={Assets.fullPath('img/nft/Frame.svg')}
              class="frame"
            ></i-image>
          </i-panel>
          <i-panel class="section">
            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Stake Amount"></i-label>
              </i-panel>
              <i-label id="stakeAmountText" caption="50,000 OSWAP" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Rewards Boost"></i-label>
                <i-icon
                  name="question-circle"
                  fill="#fff"
                  tooltip={{
                    content: 'The Reward Boost is only applicable to OSWAP staking rewards.',
                    placement: 'right'
                  }}
                ></i-icon>
              </i-panel>
              <i-label id="reward" caption="5%" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Monthly Reward"></i-label>
                <i-icon
                  name="question-circle"
                  fill="#fff"
                  tooltip={{ content: 'The Monthly Reward will be distributed at the end of each month.', placement: 'right' }}
                ></i-icon>
              </i-panel>
              <i-label id="monthlyReward" caption="5%" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Flash Sales Inclusion"></i-label>
              </i-panel>
              <i-label id="flashSales" caption="Periodic" class="value"></i-label>
            </i-panel>

            <i-button id="btnHandleStake" height="auto" class="btn-stake btn-os" caption="Stake" onClick={this.handleStake} />

            <i-hstack horizontalAlignment="start" verticalAlignment="center" margin={{ top: '0.25rem', bottom: '0.25rem' }}>
              <i-label caption="View contract" onClick={this.openLink} margin={{ right: '0.5rem' }} class="text-yellow pointer" />
              <i-icon name="external-link-alt" onClick={this.openLink} fill="#f7d063" width={15} height={15} class="text-yellow pointer" />
            </i-hstack>
          </i-panel>

        </i-panel>
      </i-panel>
    )
  }
}
