import React, { useCallback, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import NavChip from '../components/NavChip';
import HoldGate from '../components/HoldGate';
import Chip from '../components/Chip';
import ToggleSwitch from '../components/ToggleSwitch';
import SecondaryButton from '../components/SecondaryButton';
import { CaretLeftIcon } from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import type { SpeedKey } from '../constants/config';

const { width: SCREEN_W } = Dimensions.get('window');
const PANEL_W = Math.min(SCREEN_W - 32, 380);

type Props = {
  speed: SpeedKey;
  lowercase: boolean;
  bedtime: boolean;
  onSpeed: (next: SpeedKey) => void;
  onCase: (lower: boolean) => void;
  onBedtime: (next: boolean) => void;
  onReset: () => void;
  onBack: () => void;
  onHome: () => void;
};

export function GrownUpsScreen({
  speed,
  lowercase,
  bedtime,
  onSpeed,
  onCase,
  onBedtime,
  onReset,
  onBack,
  onHome,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleReset = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onReset();
  }, [confirming, onReset]);

  return (
    <AppShell variant="paper" dim={bedtime}>
      <ScreenHeader
        title="GROWN-UPS"
        leftSlot={<NavChip label="BACK" Icon={CaretLeftIcon} onPress={onBack} />}
        rightSlot={<NavChip label="HOME" image={assets.iconHome} onPress={onHome} />}
      />

      {!unlocked ? (
        <View style={styles.gateBody} pointerEvents="box-none">
          <Image source={assets.logo} style={styles.logo} />
          <Text style={styles.gateCopy}>
            THIS AREA IS FOR GROWN-UPS. HOLD THE BUTTON TO OPEN THE SETTINGS.
          </Text>
          <HoldGate onUnlock={() => setUnlocked(true)} />
          <Text style={styles.footerNote}>NO ADS - NO PURCHASES - FREE FOREVER</Text>
        </View>
      ) : (
        <View style={styles.body} pointerEvents="box-none">
          <View style={styles.panel} pointerEvents="box-none">
            <View style={styles.panelHighlight} pointerEvents="none" />

            <View style={styles.row} pointerEvents="box-none">
              <Text style={styles.rowLabel}>FALL SPEED</Text>
              <View style={styles.chipRow} pointerEvents="box-none">
                <Chip
                  label="CALM"
                  width={76}
                  active={speed === 'calm'}
                  onPress={() => onSpeed('calm')}
                />
                <Chip
                  label="NORMAL"
                  width={86}
                  active={speed === 'normal'}
                  onPress={() => onSpeed('normal')}
                />
                <Chip
                  label="QUICK"
                  width={76}
                  active={speed === 'quick'}
                  onPress={() => onSpeed('quick')}
                />
              </View>
            </View>

            <View style={styles.row} pointerEvents="box-none">
              <Text style={styles.rowLabel}>LETTER CASE</Text>
              <View style={styles.chipRow} pointerEvents="box-none">
                <Chip
                  label="ABC"
                  width={76}
                  active={!lowercase}
                  onPress={() => onCase(false)}
                />
                <Chip
                  label="abc"
                  width={76}
                  active={lowercase}
                  onPress={() => onCase(true)}
                />
              </View>
            </View>

            <View style={[styles.row, styles.rowInline]} pointerEvents="box-none">
              <View style={styles.rowTextWrap} pointerEvents="none">
                <Text style={styles.rowLabel}>BEDTIME WORDS</Text>
                <Text style={styles.rowHint}>DIMMER COLOURS, SLOWER ACORNS</Text>
              </View>
              <ToggleSwitch
                value={bedtime}
                onChange={onBedtime}
                label="BEDTIME WORDS"
              />
            </View>

            <View style={[styles.row, styles.rowLast]} pointerEvents="box-none">
              <Text style={styles.rowLabel}>RESET PROGRESS</Text>
              <SecondaryButton
                label={confirming ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
                tone="terracotta"
                onPress={handleReset}
              />
            </View>
          </View>

          <View style={styles.footer} pointerEvents="box-none">
            <Text style={styles.footerNote}>
              NO ADS - NO PURCHASES - FREE FOREVER
            </Text>
            <SecondaryButton label="BACK TO TREEHOUSE" onPress={onHome} />
          </View>
        </View>
      )}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  gateBody: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 24 },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 12 },
  gateCopy: {
    width: PANEL_W,
    marginBottom: 18,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  body: { flex: 1, alignItems: 'center', paddingBottom: 20 },
  panel: {
    width: PANEL_W,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    overflow: 'hidden',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  panelHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg.sand,
    gap: 10,
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLast: { borderBottomWidth: 0 },
  rowTextWrap: { flex: 1 },
  rowLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
  rowHint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  chipRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  footer: { marginTop: 'auto', width: PANEL_W, paddingTop: 16 },
  footerNote: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
});

export default GrownUpsScreen;
