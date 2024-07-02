import {
  Control,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Icon,
  Container
} from '@ijstech/components';
import { myCardStyle } from './myCard.css';
import { IDataMyCard } from '../store/index';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-my-card']: ControlElement;
    }
  }
}


@customElements('nft-my-card')
export class NftMyCard extends Module {
  private _cardData: IDataMyCard;
  private stakeAmount: Label;
  private trollImage: Panel;
  private reward: Label;
  private monthlyReward: Label;
  private flashSales: Label;
  private birthday: Label;
  private rarity: Panel;
  onBurn: () => void;
  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  get cardData(): IDataMyCard {
    return this._cardData
  }

  set cardData(value: IDataMyCard) {
    this._cardData = value;
    this.renderCard();
  }

  async renderStar() {
    let icon = await Icon.create();
    icon.name = 'star';
    icon.fill = '#fff';
    icon.width = 20;
    icon.height = 20;
    this.rarity.appendChild(icon);
  }

  private async renderCard() {
    const value = this.cardData;
    if (!this.stakeAmount.isConnected) await this.stakeAmount.ready();
    this.stakeAmount.caption = value.stakeAmountText;
    if (this.reward) await this.reward.ready();
    this.reward.caption = value.rewardsBoost;
    if (this.monthlyReward) await this.monthlyReward.ready();
    this.monthlyReward.caption = value.monthlyRewardText;
    if (this.flashSales) await this.flashSales.ready();
    this.flashSales.caption = value.flashSales;
    if (this.birthday) await this.birthday.ready();
    this.birthday.caption = value.birthday;
    if (this.rarity) {
      for (let i = 0; i < value.rarity; i++) {
        this.renderStar();
      }
    }

    if (this.trollImage) {
      const img1 = new Image();
      img1.url = value.image;
      this.trollImage.appendChild(img1);
    }
  }

  handleFlipCard(sender: Control, event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn-burn') || target.closest('.btn-burn')) {
      this.onBurn();
    } else {
      sender.classList.toggle('active');
    }
  }

  async init() {
    this.classList.add(myCardStyle);
    super.init();
  }

  async render() {
    return (
      <i-panel class="card-section" id="panel1" onClick={(control, e) => this.handleFlipCard(control, e)}>
        <i-panel class="bg-flip">
          <i-panel id="trollImage" class="mycard-img">
          </i-panel>
          <i-vstack verticalAlignment='space-between' class="section-my-card">
            <i-panel margin={{ top: 10 }} class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Birthday"></i-label>
              </i-panel>
              <i-label id="birthday" caption="50,000 OSWAP" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Rarity"></i-label>
              </i-panel>
              <i-panel id="rarity"></i-panel>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Value"></i-label>
              </i-panel>
              <i-label id="stakeAmount" caption="50,000 OSWAP" class="value"></i-label>
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
                  tooltip={{
                    content: "The Monthly Reward will be distributed at the end of each month.",
                    placement: 'right'
                  }}
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

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Bridge Transaction Validate"></i-label>
              </i-panel>
              <i-label id="bridge" caption="-" class="value"></i-label>
            </i-panel>

            <i-panel class="row-item">
              <i-panel class="title-icon">
                <i-label caption="Bridge Fee Earn"></i-label>
              </i-panel>
              <i-label id="fee" caption="-" class="value"></i-label>
            </i-panel>

            <i-button id="btnHandleBurn" margin={{ bottom: 10, top: 10 }} height="auto" class="btn-burn btn-os" caption="Burn" />
          </i-vstack>
        </i-panel>
      </i-panel>
    )
  }
}
