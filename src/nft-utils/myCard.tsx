import {
  Control,
  ControlElement,
  customElements,
  Label,
  Module,
  Panel,
  Image,
  Button,
  Icon,
  Container
} from '@ijstech/components';
import { myCardStyle } from './myCard.css';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['nft-my-card']: ControlElement;
    }
  }
}


@customElements('nft-my-card')
export class NftMyCard extends Module {
  private _cardData: any;
  private caption1: Label;
  private caption2: Label;
  private stakeAmount: Label;
  private trollImage: Panel;
  private reward: Label;
  private monthlyReward: Label;
  private flashSales: Label;
  private birthday: Label;
  private rarity: Panel;
  private btnHanldeStake: Button;
  private panel1: Panel;
  private _onBurn: any;
  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  get cardData(): any {
    return this._cardData
  }

  set cardData(value: any) {
    this._cardData = value;
    if (this.stakeAmount) this.stakeAmount.caption = value.stakeAmountText;
    if (this.reward) this.reward.caption = value.rewardsBoost;
    if (this.monthlyReward) this.monthlyReward.caption = value.monthlyRewardText;
    if (this.flashSales) this.flashSales.caption = value.flashSales;
    if (this.birthday) this.birthday.caption = value.birthday;
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
  async renderStar() {
    let icon = await Icon.create();
    icon.name = 'star';
    icon.fill = '#fff';
    icon.width = 20;
    icon.height = 20;
    this.rarity.appendChild(icon);
  }
  get onBurn() {
    return this._onBurn;
  }

  set onBurn(callback: any) {
    this._onBurn = callback;
  }

  handleFlipCard(sender: Control, event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn-burn') || target.closest('.btn-burn')) {
      this._onBurn();
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
