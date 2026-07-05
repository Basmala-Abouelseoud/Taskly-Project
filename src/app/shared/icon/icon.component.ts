import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName =
  | 'projects'
  | 'projects-compact'
  | 'epics'
  | 'tasks'
  | 'members'
  | 'details'
  | 'collapse'
  | 'logout';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
})
export class AppIcon {
  @Input() name!: IconName;
  @Input() width = 18;
  @Input() height = 18;
}